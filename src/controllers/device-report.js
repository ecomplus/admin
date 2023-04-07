import { i19orders } from '@ecomplus/i18n'
import { $ecomConfig, i18n, formatMoney } from '@ecomplus/utils'
import Chart from 'chart.js'
import Papa from 'papaparse'

export default function () {
  const { $, callApi } = window
  const dictionary = {
    averageTicket: i18n({
      en_us: 'Average ticket',
      pt_br: 'Ticket médio'
    }),
    mobile: i18n({
      en_us: 'Mobile',
      pt_br: 'Celular'
    }),
    tablet: i18n({
      en_us: 'Tablet',
      pt_br: 'Tablet'
    }),
    desktop: i18n({
      en_us: 'Desktop',
      pt_br: 'Computador'
    }),
    devices: i18n({
      en_us: 'Devices',
      pt_br: 'Dispositivos'
    })
  }

  const datatableOptions = {
    pageLength: 10,
    bLengthChange: false,
    order: [[1, 'desc']],
    responsive: true
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

  const datatable = $('#device-list').DataTable(datatableOptions)
  const currentYear = new Date().getFullYear()
  let start, end, type
  start = `${currentYear}-01-01`
  end = `${currentYear}-12-31`
  $('#datepicker-orders-device [data-when="start"]').datepicker('setDate', `01/01/${currentYear}`);
  $('#datepicker-orders-device [data-when="end"]').datepicker('setDate', `31/12/${currentYear}`);

  const renderGraph = (start, end, change) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          if (json && Array.isArray(json.result)) {
            const { result } = json
            const isMobileInfo = {
              count: 0,
              value: 0
            }
            const isTabletInfo = {
              count: 0,
              value: 0
            }
            const isDesktopInfo = {
              count: 0,
              value: 0
            }
            let totalCount = 0
            let totalValue = 0
            const isMobile = /iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i
            const isTablet = /iPad|Tablet|kindle|playbook|silk|puffin/i
            result.forEach(userAgent => {
              if (userAgent._id) {
                if (isMobile.test(userAgent._id)) {
                  isMobileInfo.count += userAgent.count
                  isMobileInfo.value += userAgent.total
                } else if (isTablet.test(userAgent._id)) {
                  isTabletInfo.count += userAgent.count
                  isTabletInfo.value += userAgent.total
                } else {
                  isDesktopInfo.count += userAgent.count
                  isDesktopInfo.value += userAgent.total
                }
                totalCount += userAgent.count
                totalValue += userAgent.total
              }
            })
            const percentMobileCount = (isMobileInfo.count * 100 / (totalCount || 1)).toFixed(2)
            const percentTabletCount = (isTabletInfo.count * 100 / (totalCount || 1)).toFixed(2)
            const percentDesktopCount = (isDesktopInfo.count * 100 / (totalCount || 1)).toFixed(2)
            const percentMobileValue = (isMobileInfo.value * 100 / (totalValue || 1)).toFixed(2)
            const percentTabletValue = (isTabletInfo.value * 100 / (totalValue || 1)).toFixed(2)
            const percentDesktopValue = (isDesktopInfo.value * 100 / (totalValue || 1)).toFixed(2)
            const averageTicketMobile = (isMobileInfo.value / (isMobileInfo.count || 1)).toFixed(2)
            const averageTicketTablet = (isTabletInfo.value / (isTabletInfo.count || 1)).toFixed(2)
            const averageTicketDesktop = (isDesktopInfo.value / (isDesktopInfo.count || 1)).toFixed(2)
            const rows = [
              [
                dictionary.mobile,
                isMobileInfo.count,
                formatMoney(averageTicketMobile),
                formatMoney(isMobileInfo.value)
              ],
              [
                dictionary.tablet,
                isTabletInfo.count,
                formatMoney(averageTicketTablet),
                formatMoney(isTabletInfo.value)
              ],
              [
                dictionary.desktop,
                isDesktopInfo.count,
                formatMoney(averageTicketDesktop),
                formatMoney(isDesktopInfo.value)
              ]
            ]

            datatable.clear()
            datatable.rows.add(rows)
            datatable.draw()
            if (change) {
              const { instances } = window.Chart
              const props = Object.keys(instances)
              props.forEach(prop => {
                let canva = instances[prop]
                if (canva.canvas.id.match(/^(device-report|amount-distributed|amount-distributed-count|count-distributed)$/)) {
                  canva.destroy()
                }
              })
            }
            new Chart($('#device-report'), {
              type: 'bar',
              data: {
                labels: [dictionary.mobile, dictionary.tablet, dictionary.desktop],
                datasets: [
                  {
                    label: i18n(i19orders),
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: [
                      '#00e679',
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    data: [isMobileInfo.count, isTabletInfo.count, isDesktopInfo.count]
                  }
                ]
              },
              options: {
                legend: {
                  display: true
                },
                responsive: true
              }
            })

            // Percent count
            new Chart($('#count-distributed'), {
              type: 'doughnut',
              data: {
                labels: [`${dictionary.mobile} (%)`, `${dictionary.tablet} (%)`, `${dictionary.desktop} (%)`],
                datasets: [
                  {
                    data: [percentMobileCount, percentTabletCount, percentDesktopCount],
                    backgroundColor: [
                      '#00e679',
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)'
                    ]
                  }
                ]
              },
              options: {
                responsive: true
              }
            })
            // Percent amount
            new Chart($('#amount-distributed-percent'), {
              type: 'doughnut',
              data: {
                labels: [`${dictionary.mobile} (%)`, `${dictionary.tablet} (%)`, `${dictionary.desktop} (%)`],
                datasets: [
                  {
                    data: [percentMobileValue, percentTabletValue, percentDesktopValue],
                    backgroundColor: [
                      '#ff5600',
                      '#20c997',
                      '#6610f2'
                    ]
                  }
                ]
              },
              options: {
                legend: {
                  display: true
                },
                responsive: true
              }
            })
            // Total amount
            new Chart($('#amount-distributed'), {
              type: 'doughnut',
              data: {
                labels: [`${dictionary.mobile}`, `${dictionary.tablet}`, `${dictionary.desktop}`],
                datasets: [
                  {
                    data: [isMobileInfo.value, isTabletInfo.value, isDesktopInfo.value],
                    backgroundColor: [
                      '#ff5600',
                      '#20c997',
                      '#6610f2'
                    ]
                  }
                ]
              },
              options: {
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      let dataset = data.datasets[tooltipItem.datasetIndex]
                      return formatMoney(dataset.data[tooltipItem.index])
                    }
                  }
                }
              }
            })
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
              'financial_status.current': 'paid'
            }
          },
          {
            $group: {
              _id: '$client_user_agent',
              count: {
                $sum: 1
              },
              total: {
                $sum: '$amount.total'
              }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    )
  }
  renderGraph(start, end, false)

  $('#datepicker-orders-device').datepicker({}).on('changeDate', (e) => {
    if (e.date) {
      if (e.target && e.target.dataset && e.target.dataset.when) {
        type = e.target.dataset.when
        if (type === 'start') {
          start = e.date.toISOString().slice(0, 10)
        } else if (type === 'end') {
          end = e.date.toISOString().slice(0, 10)
        }
        if (start && end) {
          renderGraph(start, end, true)
        }
      }
    }
  })
  const $exportDevice = $('#export-device')
  const downloadCsv = (exportData, name) => {
    const columns = [dictionary.devices, i18n(i19orders), `${i18n(i19orders)} %`, dictionary.averageTicket, 'Total', 'Total %']
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
  $exportDevice.click(() => {
    downloadCsv(datatable.rows().data(), 'relatorio-dispositivos')
  })
}
