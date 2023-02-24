import { i19subtotal, i19total, i19discount, i19orders } from '@ecomplus/i18n'
import { $ecomConfig, i18n } from '@ecomplus/utils'
import Papa from 'papaparse'
import Chart from 'chart.js'

export default function () {
  const { $, callApi, tabId } = window
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
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
  }
  const dictionary = {
    source: i18n({
      en_us: 'Source',
      pt_br: 'Origem'
    }),
    campaign: i18n({
      en_us: 'Campaign',
      pt_br: 'Campanha'
    })
  }
  const sourceDatatable = $('#source-list').DataTable(datatableOptions)
  const campaignDatatable = $('#campaign-list').DataTable(datatableOptions)

  const renderList = (array, datatable) => {
    const rows = []
    array.forEach(entry => {
      rows.push([
        entry._id,
        entry.count,
        formatMoney(entry.discounts),
        formatMoney(entry.subtotal),
        formatMoney(entry.total)
      ])
    })
    datatable.clear()
    datatable.rows.add(rows)
    datatable.draw()
  }

  const renderGraphs = (start, end, change = false) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const resultados  = json.result[0]
          if (change) {
            const { instances } = window.Chart
            const props = Object.keys(instances)
            props.forEach(prop => {
              let canva = instances[prop]
              if (canva.canvas.id.match(/^(campaign|source)$/)) {
                canva.destroy()
              }
            })
          }
          for (let res in resultados) {
            let campaign = resultados[res]
            if (Array.isArray(campaign) && campaign.length) {
              let arrCamp = []
              let arrLabel = []
              const campaignSliced = campaign.slice(0, 9)
              campaignSliced.forEach(camp => {
                arrCamp.push(camp.count)
                arrLabel.push(camp._id)
              })
              if (res === 'source') {
                renderList(campaign, sourceDatatable)
              } else if (res === 'campaign') {
                renderList(campaign, campaignDatatable)
              }
              new Chart($(`#${res}`), {
                type: 'bar',
                data: {
                  labels: arrLabel,
                  datasets: [
                    {
                      label: dictionary[res],
                      fill: false,
                      borderWidth: 3,
                      pointRadius: 0,
                      backgroundColor: [
                        '#00e679',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        '#704975',
                        '#ff015b',
                        '#03a9b3',
                        '#ff5600',
                        '#20c997',
                        '#6610f2'
                      ],
                      data: arrCamp
                    }
                  ]
                },
                options: {
                  legend: {
                    display: true
                  },
                  responsive: true,
                  tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      label: ({ yLabel }) => {
                        return `${yLabel} ${i18n(i19orders)}`
                      }
                    }
                  }
                }
              })
            }
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
            'utm.campaign': {
              $exists: true
            }
          } 
        },
        {
          $facet: {
            source: [
              {
                $group: { 
                  _id: { $toLower: '$utm.source'}, 
                  count: { $sum: 1 },
                  total: { $sum: '$amount.total' },
                  subtotal: { $sum: '$amount.subtotal' },
                  discounts: { $sum: '$amount.discount' },
                }
              },
              {
                $sort: { count : -1 }
              }
            ],
            campaign: [
              {
                $group: { 
                  _id: { $toLower: '$utm.campaign'},  
                  count: { $sum: 1 },
                  total: { $sum: '$amount.total' },
                  subtotal: { $sum: '$amount.subtotal' },
                  discounts: { $sum: '$amount.discount' },
                }
              },
              {
                $sort: { count : -1 }
              }
            ]
          }
        }
      ]
    }) 
  }

  const currentYear = new Date().getFullYear()
  let start, end, type
  start = `${currentYear}-01-01`
  end = `${currentYear}-12-31`
  renderGraphs(start, end)
  
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
          renderGraphs(start, end, true)
        }
      }
    }
  })

  const $exportSource = $('#export-source')
  const $exportCampaign = $('#export-campaign')
  const downloadCsv = (exportData, name) => {
    const columns = [dictionary[name], i18n(i19orders), i18n(i19discount), i18n(i19subtotal), i18n(i19total)]
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
  $exportSource.click(() => {
    downloadCsv(sourceDatatable.rows().data(), 'source')
  })
  $exportCampaign.click(() => {
    downloadCsv(campaignDatatable.rows().data(), 'campaign')
  })
}
