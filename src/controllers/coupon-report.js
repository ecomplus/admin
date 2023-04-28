import { i19discount, i19quantity } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import Papa from 'papaparse'

export default function () {
  const { $, callApi, formatMoney } = window
  const dictionary = {
    coupon: i18n({
      en_us: 'Coupon',
      pt_br: 'Cupom'
    }),
    revenue: i18n({
      en_us: 'Revenue',
      pt_br: 'Receita'
    })
  }

  let dataQuery = []

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
         <td>${entry.count}</td>
         <td>${formatMoney(entry.discount)}</td>
         <td>${formatMoney(entry.total)}</td>
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
    document.querySelector('#pagination-coupon').innerHTML = paging
    document.querySelector('#coupon-list tbody').innerHTML = result
  }

  $('#pagination-coupon').click((e) => {
    const { children } = e.currentTarget
    const option = e.target && e.target.text
    if (option) {
      const pageNumber = Number(option)
      renderTable(dataQuery, pageNumber, 10)
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

  $('#search-coupon').on('input', (e) => {
    let filter, searched;
    filter = e.currentTarget.value.toUpperCase();
    searched = dataQuery.filter(option => option._id.indexOf(filter) > -1)
    renderTable(searched, 1, 10)
  })

  const renderList = (start, end) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const { result } = json
          if (Array.isArray(result)) {
            $('#coupon-list tbody').remove()
            $('#coupon-list').append('<tbody></tbody>')
            dataQuery = []
            result.forEach(entry => dataQuery.push(entry))
            renderTable(dataQuery, 1, 10)
          }
        }
      },
      {
        resource: 'orders',
        pipeline: [
          { 
            $match : {
            created_at: {
              $gte: start.toISOString(),
              $lte: end.toISOString(),
            },
            'financial_status.current': 'paid',
            'extra_discount.flags': {
              $in: ['COUPON']
            }
          } 
        },
        {
          $group: {
            _id: {
              $toUpper: '$extra_discount.discount_coupon'
            },
            count: {
              $sum: 1
            },
            total: {
              $sum: '$amount.total'
            },
            discount: {
              $sum: '$extra_discount.value'
            }
          } 
        }
      ]
    }) 
  }
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

  renderList(start, end)

  $('#datepicker-coupon [data-when="start"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(start));
  $('#datepicker-coupon [data-when="end"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(end));

  $('#datepicker-coupon').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = normalizeDate(0, 0, 0, 0, false, e.date)
        } else if (type === 'end') {
          end = normalizeDate(23, 59, 59, 59, false, e.date)
        }
        if (start && end) {
          renderList(start, end)
        }
      }
    }
  })

  const $exportCoupon = $('#export-coupon')
  const downloadCsv = (exportData, name) => {
    const columns = [dictionary.coupon, i18n(i19quantity), i18n(i19discount), dictionary.revenue]
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
    $link.setAttribute('download', `${name}.csv`)
    $link.click()
  }
  $exportCoupon.click(() => {
    renderTable(dataQuery, 1, dataQuery.length)
    const data = []
    $('#coupon-list').find('tr:not(:first)').each(function(i, row) {
      const cols = []
      $(this).find('td').each(function(i, col) {
        cols.push($(this).text())
      })
      data.push(cols)
    })
    downloadCsv(data, 'coupon-report')
    renderTable(dataQuery, 1, 10)
  })
}
