import { i19orders, i19freight, i19quantity, i19freeShipping } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import Chart from 'chart.js'

export default function () {
  const { $, callApi, formatMoney, moment } = window

  const dictionary = {
    averageFreight: i18n({
      en_us: 'Average freight',
      pt_br: 'Média de frete'
    }),
    usedFreight: i18n({
      en_us: 'Used freight',
      pt_br: 'Frete utilizado'
    }),
    ordersWithFreight: i18n({
      en_us: `${i18n(i19orders)} with ${i18n(i19freight)}`,
      pt_br: `${i18n(i19orders)} com ${i18n(i19freight)}`
    }),
    pointsActive: i18n({
      en_us: 'Available points',
      pt_br: 'Pontos disponiveis'
    }),
    pointsUsed: i18n({
      en_us: 'Used points',
      pt_br: 'Pontos utilizados'
    })
  }

  // Init Tables
  const datatableOptions = {
    scrollY: '200px',
    scrollCollapse: true,
    paging: false
  }
  datatableOptions.language = {
    infoEmpty: '',
    infoFiltered: '',
    lengthMenu: 'Mostrar _MENU_ resultados',
    search: 'Buscar',
    zeroRecords: 'Nenhum resultado encontrado',
    info: 'Mostrando _START_ a _END_',
  }

  // Get html
  const $infoTotalFreight = $('#totalFreight')
  const $infoAverageFreight = $('#averageFreight')
  const $infoCountFreight = $('#countFreight')
  const $infoPercentFreight = $('#percentFreight')
  const $infoHighestFreight = $('#highestFreight')
  const $infoLowestFreight = $('#lowestFreight')

  const $infoAverageFreeFreight = $('#averageFreeFreight')
  const $infoCountFreeFreight = $('#countFreeFreight')
  const $infoPercentFreeFreight = $('#percentFreeFreight')
  const $infoHighestFreeFreight = $('#highestFreeFreight')
  const $infoLowestFreeFreight = $('#lowestFreeFreight')

  const $listStates = $('#list-by-state')
  const $listShipping = $('#list-shipping')
  const datatableShipping = $listShipping.DataTable(datatableOptions)
  const datatableStates = $listStates.DataTable(datatableOptions)

  // Get cashback from year
  const currentYear = new Date().getFullYear()
  
  const fillMonths = (resultado, properties ) => {
    let result
    if (resultado.length !== 12) {
      result = Array.from(Array(12)).map((item, index) => {
        const existingMonth = resultado.find(month => month._id ===  index + 1);
        return existingMonth || { _id:  index + 1, ...properties }; 
      })
    } else {
      result = resultado
    }
    return result
  }

  const genericReduce = (array) => {
    return array.reduce((acum, next) => Number(acum) + Number(next), 0)
  }

  const genericAverage = (amount, quantity) => {
    return amount / (quantity || 1)
  }

  const genericPercent = (num, den) => {
    return num / (den || 1) * 100
  }

  const renderList = (array, datatable) => {
    const rows = []
    array.forEach(entry => {
      rows.push([
        Array.isArray(entry._id) ? entry._id[0] : entry._id,
        entry.freeFreight,
        entry.countFreight,
        formatMoney(entry.totalFreight.toFixed(2)),
        formatMoney((entry.totalFreight / (entry.countFreight || 1)).toFixed(2))
      ])
    })
    datatable.clear()
    datatable.rows.add(rows)
    datatable.draw()
  }

  const renderGraphByYear = (year, change) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const totalFreightMonth = []
          const freeFreightMonth = []
          const totalCountMonth = []
          const averageFreightMonth = []
          const amountMonth = []
          if (Array.isArray(json.result)) {
            const resultado = json.result
            const properties = {
              countFreight: 0,
              totalFreight: 0,
              freeFreight: 0,
              amount: 0
            }
            const result = fillMonths(resultado, properties)
            result.forEach(month => {
              const average = month.totalFreight / (month.countFreight || 1)
              totalFreightMonth.push(month.totalFreight.toFixed(2))
              freeFreightMonth.push(month.freeFreight.toFixed(2))
              totalCountMonth.push(month.countFreight)
              averageFreightMonth.push(average.toFixed(2))
              amountMonth.push(month.amount.toFixed(2))
            })
            const totalFreightYear = genericReduce(totalFreightMonth)
            const totalCountYear = genericReduce(totalCountMonth)
            const totalAmountYear = genericReduce(amountMonth)
            const freeFreightYear = genericReduce(freeFreightMonth)
            const averageYear = genericAverage(totalFreightYear, totalCountYear).toFixed(2)
            const averageFreeFreight = Math.round(genericAverage(freeFreightYear, 12))
            const percentFreightByAmount = (genericPercent(totalFreightYear, totalAmountYear)).toFixed(2)
            const percentFreebyAll = genericPercent(freeFreightYear, freeFreightYear + totalCountYear).toFixed(2)
            const maxMonthFreight = Math.max(...totalFreightMonth)
            const minMonthFreight = Math.min(...totalFreightMonth)
            const maxMonthFreeFreight = Math.max(...freeFreightMonth)
            const minMonthFreeFreight = Math.min(...freeFreightMonth)

            $infoTotalFreight.text(formatMoney(totalFreightYear))
            $infoCountFreight.text(totalCountYear)
            $infoAverageFreight.text(formatMoney(Number(averageYear)))
            $infoPercentFreight.text(`${percentFreightByAmount} %`)
            $infoHighestFreight.text(formatMoney(maxMonthFreight))
            $infoLowestFreight.text(formatMoney(minMonthFreight))


            $infoCountFreeFreight.text(freeFreightYear)
            $infoAverageFreeFreight.text(averageFreeFreight)
            $infoPercentFreeFreight.text(`${percentFreebyAll} %`)
            $infoHighestFreeFreight.text(maxMonthFreeFreight)
            $infoLowestFreeFreight.text(minMonthFreeFreight)
            
            if (change) {
              const { instances } = window.Chart
              const props = Object.keys(instances)
              props.forEach(prop => {
                let canva = instances[prop]
                if (canva.canvas.id.match(/^(freight-year|free-freight-year)$/)) {
                  canva.destroy()
                }
              })
            }
            const labelMonths = moment.months()
            new Chart($('#freight-year'), {
              type: 'bar',
              data: {
                labels: labelMonths,
                datasets: [     
                  {
                    type: 'line',
                    label: i18n(dictionary.ordersWithFreight),
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    borderColor: "#704975",
                    backgroundColor: "#704975",
                    data: totalCountMonth
                  },
                  {
                    label: `${i18n(dictionary.usedFreight)} - ${year}`,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#00e679",
                    borderColor: "#00e679",
                    data: totalFreightMonth
                  },
                  {
                    type: 'line',
                    label: i18n(dictionary.averageFreight),
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    borderColor: "#ff015b",
                    backgroundColor: "#ff015b",
                    data: averageFreightMonth
                  }
                ]
              },
              options: {
                tooltips: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    label: ({ yLabel, datasetIndex }) => {
                      if (datasetIndex  === 1) {
                        return `${formatMoney(yLabel)} ${i18n(dictionary.usedFreight)}`
                      } else if (datasetIndex  === 2) {
                        return `${formatMoney(yLabel)} ${i18n(dictionary.averageFreight)}`
                      }
                      return `${yLabel} ${i18n(dictionary.ordersWithFreight)}`
                    }
                  }
                }
              }
            })

            new Chart($('#free-freight-year'), {
              type: 'bar',
              data: {
                labels: labelMonths,
                datasets: [     
                  {
                    label: `${i18n(i19orders)} ${i18n(i19freeShipping)}`,
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#704975",
                    data: freeFreightMonth
                  }
                ]
              },
              options: {
                tooltips: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    label: ({ yLabel, datasetIndex }) => {
                      if (datasetIndex) {
                        return formatMoney(yLabel)
                      }
                      return `${yLabel} ${i18n(i19orders)} ${i18n(i19freeShipping)}`
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
              $gte: `${year}-01-01T03:00:00.000Z`,
              $lte: `${year + 1}-01-01T02:59:59.999Z`,
            },
            'financial_status.current': 'paid',
          },
        },
        {
          $group: {
            _id: {
              $month: '$created_at'
            },
            countFreight: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$amount.freight',
                      1,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            freeFreight: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      '$amount.freight',
                      0,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            amount: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      '$financial_status.current',
                      'paid',
                    ],
                  },
                  '$amount.total',
                  0,
                ],
              },
            },
            totalFreight: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$amount.freight',
                      1,
                    ],
                  },
                  '$amount.freight',
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: {
            _id: 1,
          }
        }
      ]
      }
    )
  }

  const renderTop3Graph = (_id, datatable, $id, year, change) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const resultado = json.result
          const labels = []
          const countFreight = []
          const totalFreight = []
          const freeFreight = []
          const average = []
          const count = []
          resultado.forEach(entry => {
            labels.push(Array.isArray(entry._id) ? entry._id[0] : entry._id)
            countFreight.push(entry.countFreight)
            freeFreight.push(entry.freeFreight)
            totalFreight.push(entry.totalFreight.toFixed(2))
            count.push(entry.count)
            average.push(genericAverage(entry.totalFreight, entry.countFreight).toFixed(2))
          })
          if (Array.isArray(resultado) && resultado.length > 0) {
            renderList(resultado, datatable) 
            if (change) {
              const { instances } = window.Chart
              const props = Object.keys(instances)
              props.forEach(prop => {
                let canva = instances[prop]
                if (canva.canvas.id.match($id.replace('#', ''))) {
                  canva.destroy()
                }
              })
            }  
            new Chart($($id), {
              type: 'bar',
              data: {
                labels: labels.slice(0, 3),
                datasets: [     
                  {
                    type: 'bar',
                    label: `${i18n(i19orders)} ${i18n(i19freeShipping)}`,
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#704975",
                    data: freeFreight.slice(0, 3)
                  },
                  {
                    type: 'bar',
                    label: `${i18n(i19orders)} ${i18n(i19freight)}`,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#00e679",
                    data: countFreight.slice(0, 3)
                  }
                ]
              },
              options: {
                tooltips: {
                  mode: 'index',
                  intersect: false,
                  callbacks: {
                    label: ({ yLabel }) => {
                      return yLabel
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
                $gte: `${year}-01-01T03:00:00.000Z`,
                $lte: `${year + 1}-01-01T02:59:59.999Z`,
              },
              'financial_status.current': 'paid',
            }
          },
          {
            $group: {
              _id: _id,
              count: {
                $sum: 1
              },
              freeFreight: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        '$amount.freight',
                        0,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              countFreight: {
                $sum: {
                  $cond: [
                    {
                      $gte: [
                        '$amount.freight',
                        1,
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              totalFreight: {
                $sum: {
                  $cond: [
                    {
                      $gte: [
                        '$amount.freight',
                        1,
                      ],
                    },
                    '$amount.freight',
                    0,
                  ],
                },
              },
            }
          },
          {
            $sort: {
              count : -1 
            }
          }
        ]
      }
    )
  }

  //renderListStateByYear(currentYear)
  renderGraphByYear(currentYear, false)
  renderTop3Graph('$shipping_lines.to.province_code', datatableStates, '#annual-state', currentYear)
  renderTop3Graph('$shipping_method_label', datatableShipping, '#annual-shipping', currentYear)
  //renderListShippingByYear(currentYear, false)


  $('#datepicker').datepicker(
    {
      format: 'yyyy',
      viewMode: 'years', 
      minViewMode: 'years',
      defaultViewDate: 'year'
    }
  ).on('changeDate', (e) => {
    if (e.date) {
      const year = e.date.getFullYear()
      const change = true
      renderGraphByYear(year, change)
      renderTop3Graph('$shipping_lines.to.province_code', datatableStates, '#annual-state', year, true)
      renderTop3Graph('$shipping_method_label', datatableShipping, '#annual-shipping', year, true)
    }
  })
}
