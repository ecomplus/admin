import { i19number, i19email, i19permalink, i19name, i19total } from '@ecomplus/i18n'
import { $ecomConfig, i18n, formatMoney } from '@ecomplus/utils'
import Papa from 'papaparse'

export default function () {
  const { $, callApi, tabId, Store } = window
  const { domain } = Store
  let urlCart
  if (domain) {
    urlCart = `https://${domain}/app/#/cart/`
  }

  const datatableOptions = {
    pageLength: 20,
    bLengthChange: false,
    order: [[3, 'desc']]
  }

  if ($ecomConfig.get('lang') === 'pt_br') {
    datatableOptions.language = {
      aria: {
        sortAscending: ': ative para colocar a coluna em ordem crescente',
        sortDescending: ': ative para colocar a coluna em ordem decrescente'
      },
      paginate: {
        next: 'Próxima',
        previous: 'Anterior'
      },
      emptyTable: 'Tabela vazia',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ Carrinhos carregados',
      infoEmpty: '',
      infoFiltered: '',
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
  }

  const datatable = $('#abandoned-cart').DataTable(datatableOptions)

  const renderTable = (customers, result, datatable) => {
    const rows = []
    if (Array.isArray(result) && result.length) {
      result.forEach(cart => {
        const selectedCustomer = customers.find(customer => customer._id === cart._id)
        if (selectedCustomer) {
          let name = ''
          if (selectedCustomer.name) {
            if (selectedCustomer.name.given_name) {
              name += selectedCustomer.name.given_name
            }
            if (selectedCustomer.name.family_name) {
              name += ' ' + selectedCustomer.name.family_name
            } 
          }
          rows.push([
            name,
            selectedCustomer.email,
            selectedCustomer.phone && selectedCustomer.phone.length && selectedCustomer.phone[0] || 'Sem número',
            urlCart ? urlCart + cart.cartId : 'Sem url configurada',
            formatMoney(cart.subtotal)
          ])
        }
      })
      datatable.clear()
      datatable.rows.add(rows)
      datatable.draw()
      $('#abandoned-cart-table-load').hide()
    }
  }

  const renderListByDate = async (start, end) => {
    datatable.clear()
    datatable.draw()
    $('#abandoned-cart-table-load').show()
    callApi(
      '$aggregate.json',
      'POST',
      async (err, json) => {
        if (!err) {
          const { result } = json
          if (Array.isArray(result) && result.length) {
            const carts = []
            const ids = []
            let customers = []
            result.forEach(cart => {
              carts.push(cart)
              ids.push(cart._id)
            })
            const sizeArray = 200
            let arraySliced
            let init = 0
            const loops = ids.length > 200 ? Math.ceil(ids.length / sizeArray) : 1
            const rows = []
            for (let index = 0; index < loops; index++) {
              init++
              arraySliced = ids.slice(index * sizeArray, sizeArray * init)
              callApi(
                '$aggregate.json',
                'POST',
                (err, json) => {
                  if (!err) {
                    customers = customers.concat(json.result)
                    if ((index + 1) === loops) {
                      renderTable(customers, carts, datatable)
                    }
                  }
                },
                {
                  resource: 'customers',
                  pipeline: [
                    {
                      $match: {
                        'login': true,
                        '_id': {
                          $in: arraySliced
                        }
                      }
                    },
                    {
                      $group: {
                        _id: '$_id',
                        email: {
                          $first: '$main_email'
                        },
                        name: {
                          $first: '$name'
                        },
                        phone: {
                          $first: '$phones.number'
                        }
                      }
                    }
                  ]
                }
              )
            }
          }
        }
      },
      {
        resource: 'carts',
        pipeline: [
          {
            $match: {
              created_at: {
                $gte: start.toISOString(),
                $lte: end.toISOString(),
              },
              'completed': false
            }
          },
          {
            $unwind: '$customers'
          },
          {
            $group: {
              _id: '$customers',
              cartId: {
                $last: '$_id'
              },
              subtotal: {
                $last: '$subtotal'
              }
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
  
  $('#datepicker-abandoned [data-when="start"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(start));
  $('#datepicker-abandoned [data-when="end"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(end));

  renderListByDate(start, end)

  $('#datepicker-abandoned').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = normalizeDate(0, 0, 0, 0, false, e.date)
        } else if (type === 'end') {
          end = normalizeDate(23, 59, 59, 59, false, e.date)
        }
        if (start && end) {
          renderListByDate(start, end)
        }
      }
    }
  })

  const $exportBestSeller = $('#export-abandoned-cart')
  const downloadCsv = exportData => {
  const columns = [i18n(i19name), i18n(i19email), i18n(i19number), i18n(i19permalink), i18n(i19total)]
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
  $link.setAttribute('download', 'export-abandoned-cart.csv')
  $link.click()
  $(`#t${tabId}-loading`).hide()
  }
  $exportBestSeller.click(() => {
    downloadCsv(datatable.rows().data())
  })
}

