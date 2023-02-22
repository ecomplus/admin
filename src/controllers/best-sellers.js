import { i19sku, i19name, i19price, i19sales, i19total } from '@ecomplus/i18n'
import { $ecomConfig, i18n, formatMoney } from '@ecomplus/utils'
import Papa from 'papaparse'

export default function () {
  const { $, callApi, tabId } = window

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
      info: 'Mostrando _START_ a _END_ de _TOTAL_ SKUs carregados',
      infoEmpty: '',
      infoFiltered: '',
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
  }

  const datatable = $('#most-sellers-table').DataTable(datatableOptions)
  const renderGraphByDate = (start, end) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const { result } = json
          const rows = []
          if (Array.isArray(result) && result.length) {
            result.forEach(item => {
              rows.push([
                item._id,
                item.name,
                formatMoney(item.amount / (item.count || 1)),
                item.count || 0,
                formatMoney(item.amount)
              ])
            })
            datatable.clear()
            datatable.rows.add(rows)
            datatable.draw()
            $('#most-sellers-table-load').hide()
          }
        }
      },
      {
        resource: 'orders',
        pipeline: [
          {
            $match: {
              created_at: {
                $gte: `${start}T03:00:00.000Z`,
                $lte: `${end}T02:59:59.999Z`,
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
              name: { $first:  '$items.name' }
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
  const currentYear = new Date().getFullYear()
  let start, end, type
  start = `${currentYear}-01-01`
  end = `${currentYear}-12-31`
  renderGraphByDate(start, end)
  
  $('#datepicker [data-when="start"]').datepicker('setDate', `01/01/${currentYear}`);
  $('#datepicker [data-when="end"]').datepicker('setDate', `31/12/${currentYear}`);

  $('#datepicker').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = e.date.toISOString().slice(0,10)
        } else if (type === 'end') {
          end = e.date.toISOString().slice(0,10)
        }
        if (start && end) {
          datatable.clear()
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
    downloadCsv(datatable.rows().data())
  })
}