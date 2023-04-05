import { i19freight, i19discount, i19quantity } from '@ecomplus/i18n'
import { $ecomConfig, i18n } from '@ecomplus/utils'
import Papa from 'papaparse'

export default function () {
  const { $, callApi } = window
  const datatableOptions = {
    pageLength: 10,
    bLengthChange: false,
    order: [[1, 'desc']]
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
      infoEmpty: '',
      infoFiltered: '',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ cupons carregados',
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
  }
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
  const datatable = $('#coupon-list').DataTable(datatableOptions)

  const renderList = (start, end) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const { result } = json
          if (Array.isArray(result) && result.length) {
            const rows = []
            result.forEach(entry => {
              rows.push([
                entry._id,
                entry.count,
                formatMoney(entry.discount),
                formatMoney(entry.freight),
                formatMoney(entry.total)
              ])
            })
            datatable.clear()
            datatable.rows.add(rows)
            datatable.draw()
          }
        }
      },
      {
        resource: 'orders',
        pipeline: [
          { 
            $match : {
            created_at: {
              $gte: `${start}T03:00:00.000Z`,
              $lte: `${end}T02:59:59.999Z`,
            },
            'financial_status.current': 'paid',
            'extra_discount.discount_coupon': {
              $exists: true,
              $ne: ''
            },
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
            },
            freight: {
              $sum: '$amount.freight'
            }
          } 
        }
      ]
    }) 
  }

  const currentYear = new Date().getFullYear()
  let start, end, type
  start = `${currentYear}-01-01`
  end = `${currentYear}-12-31`
  renderList(start, end)
  
  $('#datepicker-coupon [data-when="start"]').datepicker('setDate', `01/01/${currentYear}`);
  $('#datepicker-coupon [data-when="end"]').datepicker('setDate', `31/12/${currentYear}`);

  $('#datepicker-coupon').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = e.date.toISOString().slice(0,10)
        } else if (type === 'end') {
          end = e.date.toISOString().slice(0,10)
        }
        if (start && end) {
          renderList(start, end)
        }
      }
    }
  })

  const $exportCoupon = $('#export-coupon')
  const downloadCsv = (exportData, name) => {
    const columns = [dictionary.coupon, i18n(i19quantity), i18n(i19discount), i18n(i19freight), dictionary.revenue]
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
    downloadCsv(datatable.rows().data(), 'coupon-report')
  })
}
