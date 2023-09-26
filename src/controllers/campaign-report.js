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

  const renderList = (array, datatable, total) => {
    const rows = []
    array.forEach(entry => {
      rows.push([
        entry._id,
        entry.count,
        `${(entry.count * 100 / (total || 1)) .toFixed(2)} %`,
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
              let total = 0
              campaign.forEach(camp => {
                arrCamp.push(camp.count)
                arrLabel.push(camp._id)
              })
              total = arrCamp.reduce((acc, curr) => Number(acc) + Number(curr), 0)
              if (res === 'source') {
                renderList(campaign, sourceDatatable, total)
              } else if (res === 'campaign') {
                renderList(campaign, campaignDatatable, total)
              }
              new Chart($(`#${res}`), {
                type: 'bar',
                data: {
                  labels: arrLabel.slice(0,9),
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
                      data: arrCamp.slice(0, 9)
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
              $gte: start.toISOString(),
              $lte: end.toISOString(),
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
                  _id: '$utm.source', 
                  count: { $sum: 1 },
                  total: { $sum: '$amount.total' },
                  subtotal: { $sum: '$amount.subtotal' },
                  discounts: { $sum: '$amount.discount' }
                }
              },
              {
                $sort: { count : -1 }
              }
            ],
            campaign: [
              {
                $group: { 
                  _id: '$utm.campaign',  
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
  end = normalizeDate(23, 59, 59, 999, false, false)
  renderGraphs(start, end)
  
  $('#datepicker-utm [data-when="start"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(start));
  $('#datepicker-utm [data-when="end"]').datepicker('setDate', new Intl.DateTimeFormat('pt-br').format(end));

  $('#datepicker-utm').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = normalizeDate(0, 0, 0, 0, false, e.date)
        } else if (type === 'end') {
          end = normalizeDate(23, 59, 59, 59, false, e.date)
        }
        if (start && end) {
          renderGraphs(start, end, true)
        }
      }
    }
  })

  $('#source-list').on('click', 'td', function () {
    const table = $('#source-list').DataTable();
    const data = table.cell( this ).data();
    window.location.href = `/#/resources/orders?utm.source=${data}&financial_status.current=paid&created_at>=${start.toISOString()}&created_at<=${end.toISOString()}`
  })

  $('#campaign-list').on('click', 'td', function () {
    const table = $('#campaign-list').DataTable();
    const data = table.cell( this ).data();
    window.location.href = `/#/resources/orders?utm.campaign=${data}&financial_status.current=paid&created_at>=${start.toISOString()}&created_at<=${end.toISOString()}`
  })

  const $exportSource = $('#export-source')
  const $exportCampaign = $('#export-campaign')
  const downloadCsv = (exportData, name) => {
    const columns = [dictionary[name], i18n(i19orders), '%', i18n(i19discount), i18n(i19subtotal), i18n(i19total)]
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
