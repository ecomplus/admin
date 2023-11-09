import { i19sku, i19name, i19price, i19sales, i19total } from '@ecomplus/i18n'
import { i18n, formatMoney } from '@ecomplus/utils'
import Papa from 'papaparse'

export default function () {
  const { $, callApi, tabId, callSearchApi } = window

  const normalizeDate = (hour, min, sec, ms, sub, date) => {
    const currentDate = date || new Date()
    if (sub) {
      const dateWithSub = currentDate.getDate() - sub
      currentDate.setDate(dateWithSub)
    }
    const finalDate = new Date(currentDate)
    const dateWithHours = finalDate.setHours(hour, min, sec, ms)
    return new Date(dateWithHours)
  }
  let start, end, type
  start = normalizeDate(0, 0, 0, 0, 30, false)
  end = normalizeDate(23, 59, 59, 59, false, false)

  let dataQuery = []

  let searchedProductsByCategory = []

  const renderTable = (data, currentPage, pageSize) => {
    // create html
    let result = ''
    let paging = ''
    data.filter((row, index) => {
      const start = (currentPage - 1) * pageSize
      const end = currentPage * pageSize
      return (index >= start && index < end)
    }).forEach(entry => {
      result += `
       <tr>
         <td>${entry._id}</td>
         <td>${entry.name}</td>
         <td>${formatMoney(entry.amount / (entry.count || 1))}</td>
         <td>${entry.count || 0}</td>
         <td>${formatMoney(entry.amount)}</td>
       </tr>`
    })
    const numOfPaging = Math.ceil(data.length / pageSize)
    for (let i = 1; i <= numOfPaging; i++) {
      paging += `
      <li class="page-item${i === 1 ? ' active' : ''}">
        <a class="page-link" href="#">${i}</a>
      </li>
      `
    }
    document.querySelector('#pagination-best-seller').innerHTML = paging
    document.querySelector('#best-seller-list tbody').innerHTML = result
  }

  $('#pagination-best-seller').click((e) => {
    const { children } = e.currentTarget
    const option = e.target && e.target.text
    let filter, searched;
    filter = $('#search-best-seller').val()
    searched = dataQuery
    if (searchedProductsByCategory.length) {
      searched = searched.filter(({ id }) => {
        return searchedProductsByCategory.some(({ _id }) => _id === id)
      })
    }
    if (filter) {
      filter = filter.toLowerCase();
      searched = searched.filter(({ _id, name }) => {
        return _id.indexOf(filter) > -1 || name.toLowerCase().indexOf(filter) > -1
      })
    }
    if (option) {
      const pageNumber = Number(option)
      renderTable(searched, pageNumber, 10, start, end)
      for (const key in children) {
        if (Object.hasOwnProperty.call(children, key)) {
          if (key == (pageNumber - 1)) {
            children[key].classList.add('active')
          } else {
            children[key].classList.remove('active') 
          } 
        }
      }
    }
  })

  callApi('categories.json', 'GET', function (error, data) {
    if (!error) {
      let $option
      $option = $('<option />', {
        text: '--',
        value: 'undefined'
      })
      $('#searchCategory').append($option).appSelectpicker('refresh').trigger('change')
      for (let i = 0; i < data.result.length; i++) {
        const valueCategory = function () {
          return JSON.stringify({
            name: data.result[i].name,
            resource: 'categories'
          })
        }
        $option = $('<option />', {
          text: data.result[i].name,
          value: valueCategory(data.result[i])
        })
        $('#searchCategory').append($option).appSelectpicker('refresh').trigger('change')
      }
    }
  })

  $('#searchCategory').change(function () {
    const selectedCategory = $(this).val()
    let searched = dataQuery
    if (selectedCategory !== 'undefined') {
      const body = {"query":{"bool":{"filter":[{"terms":{"categories.name":[JSON.parse(selectedCategory).name]}}]}},"sort":[{"_id":{"order":"desc"}}],"aggs":{"brands.name":{"terms":{"field":"brands.name","size":100}},"categories.name":{"terms":{"field":"categories.name","size":300}},"status":{"terms":{"field":"status"}},"min_price":{"min":{"field":"price"}},"max_price":{"max":{"field":"price"}},"avg_price":{"avg":{"field":"price"}}},"size":500,"from":0}
      callSearchApi('items.json', 'POST', function (err, data) {
        if (!err && data.hits) {
          searchedProductsByCategory = [...data.hits.hits]
          let filter
          filter = $('#search-best-seller').val()
          searched = searched.filter(({ id }) => {
            return searchedProductsByCategory.some(({ _id }) => _id === id)
          })
          if (filter) {
            filter = filter.toLowerCase();
            searched = searched.filter(({ _id, name }) => {
              return _id.indexOf(filter) > -1 || name.toLowerCase().indexOf(filter) > -1
            })
          }
          renderTable(searched, 1, 10, start, end)
        }
      }, body)
    }
    searchedProductsByCategory = []
    renderTable(searched, 1, 10, start, end)
  })

  $('#search-best-seller').on('input', (e) => {
    let filter, searched;
    filter = e.currentTarget.value.toLowerCase();
    searched = dataQuery
    if (searchedProductsByCategory.length) {
      searched = searched.filter(({ id }) => {
        return searchedProductsByCategory.some(({ _id }) => _id === id)
      })
    }
    searched = searched.filter(option => {
      return option._id.indexOf(filter) > -1 || option.name.toLowerCase().indexOf(filter) > -1
    })
    renderTable(searched, 1, 10, start, end)
  })

  const renderGraphByDate = (start, end) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const { result } = json
          if (Array.isArray(result)) {
            $('#best-seller-list tbody').remove()
            $('#best-seller-list').append('<tbody></tbody>')
            dataQuery = []
            result.forEach(entry => dataQuery.push(entry))
            renderTable(dataQuery, 1, 10, start, end)
          }
        }
      },
      {
        resource: 'orders',
        pipeline: [
          {
            $match: {
              created_at: {
                $gte: start.toISOString(),
                $lte: end.toISOString(),
              },
              'financial_status.current': 'paid',
            }
          },
          {
            $unwind: '$items'
          },
          {
            $group: {
              _id: '$items.sku',
              count: {
                $sum: '$items.quantity'
              },
              amount: {
                $sum: {
                  $multiply: ['$items.price', '$items.quantity']
                }
              },
              sku: { $first: '$items.sku' },
              name: { $first: '$items.name' },
              id: { $first: '$items.product_id' }
            }
          },
          {
            $sort: {
              count: -1
            }
          }
        ]
      }
    )
  }

  renderGraphByDate(start, end)
  
  $('#datepicker-best-seller [data-when="start"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(start));
  $('#datepicker-best-seller [data-when="end"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(end));

  $('#datepicker-best-seller').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = normalizeDate(0, 0, 0, 0, false, e.date)
        } else if (type === 'end') {
          end = normalizeDate(23, 59, 59, 59, false, e.date)
        }
        if (start && end) {
          $('#most-sellers-table-load').show()
          renderGraphByDate(start, end)
        }
      }
    }
  })
  const $exportBestSeller = $('#export-best-seller')
  const downloadCsv = exportData => {
    const columns = [i18n(i19sku), i18n(i19name), i18n(i19price), i18n(i19sales), i18n(i19total)]
    const csv = Papa.unparse({
      data: exportData,
      fields: columns
    })
    const csvData = new window.Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    })
    const csvURL = navigator.msSaveBlob
      ? navigator.msSaveBlob(csvData, 'download.csv')
      : window.URL.createObjectURL(csvData)
    const $link = document.createElement('a')
    $link.href = csvURL
    $link.setAttribute('download', 'export-most-sellers.csv')
    $link.click()
    $(`#t${tabId}-loading`).hide()
  }
  $exportBestSeller.click(() => {
    let filter, searched;
    filter = $('#search-best-seller').val()
    searched = dataQuery
    if (searchedProductsByCategory.length) {
      searched = searched.filter(({ id }) => {
        return searchedProductsByCategory.some(({ _id }) => _id === id)
      })
    }
    if (filter) {
      filter = filter.toLowerCase();
      searched = searched.filter(({ _id, name }) => {
        return _id.indexOf(filter) > -1 || name.toLowerCase().indexOf(filter) > -1
      })
    }
    renderTable(searched, 1, searched.length, start, end)
    const data = []
    $('#best-seller-list').find('tr:not(:first)').each(function(i, row) {
      const cols = []
      $(this).find('td').each(function(i, col) {
        cols.push($(this).text())
      })
      data.push(cols)
    })
    downloadCsv(data, 'best-seller-report')
    renderTable(searched, 1, 10, start, end)
  })
}
