import { i19orders, i19quantity, i19pointsEarned, i19total } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import Chart from 'chart.js'

export default function () {
  const { $, callApi, tabId, formatMoney } = window

  const dictionary = {
    january: i18n({
      en_us: 'January',
      pt_br: 'Janeiro'
    }),
    february: i18n({
      en_us: 'February',
      pt_br: 'Fevereiro'
    }),
    march: i18n({
      en_us: 'March',
      pt_br: 'Março'
    }),
    april: i18n({
      en_us: 'April',
      pt_br: 'Abril'
    }),
    may: i18n({
      en_us: 'May',
      pt_br: 'Maio'
    }),
    june: i18n({
      en_us: 'June',
      pt_br: 'Junho'
    }),
    august: i18n({
      en_us: 'August',
      pt_br: 'Agosto'
    }),
    july: i18n({
      en_us: 'July',
      pt_br: 'Julho'
    }),
    september: i18n({
      en_us: 'September',
      pt_br: 'Setembro'
    }),
    october: i18n({
      en_us: 'October',
      pt_br: 'Outubro'
    }),
    november: i18n({
      en_us: 'November',
      pt_br: 'Novembro'
    }),
    december: i18n({
      en_us: 'December',
      pt_br: 'Dezembro'
    }),
    usedCashback: i18n({
      en_us: 'Used cashback',
      pt_br: 'Cashback utilizado'
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

  // Get cashback from year
  const currentYear = new Date().getFullYear()
  const renderGraphByYear = (year, change) => {
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err) {
          const totalPointsMonth = []
          const totalCountMonth = []
          const totalMoneyMonth = []
          if (Array.isArray(json.result)) {
            const resultado = json.result
            let result
            if (resultado.length !== 12) {
              result = Array.from(Array(12)).map((item, index) => {
                let value = 0
                const existingMonth = resultado.find(month => month._id ===  index + 1);
                value = (existingMonth || {money:value}).money;
                return existingMonth || { _id:  index + 1, money: value, count: value, points: value }; 
              })
            } else {
              result = resultado
            }
            result.forEach(month => {
              totalPointsMonth.push(month.points.toFixed(2))
              totalCountMonth.push(month.count)
              totalMoneyMonth.push(month.money.toFixed(2))
            })
            const totalMoneyYear = totalMoneyMonth.reduce((acum, next) => Number(acum) + Number(next), 0)
            const totalCountYear = totalCountMonth.reduce((acum, next) => Number(acum) + Number(next), 0)
            
            if (change) {
              const { instances } = window.Chart
              const props = Object.keys(instances)
              props.forEach(prop => {
                let canva = instances[prop]
                if (canva.canvas.id.match(/^(cashback-year|anual-cashback)$/)) {
                  canva.destroy()
                }
              })
            }
            new Chart($('#cashback-year'), {
              type: 'bar',
              data: {
                labels: [i18n(dictionary.january), i18n(dictionary.february), i18n(dictionary.march), i18n(dictionary.april), i18n(dictionary.may), i18n(dictionary.june), i18n(dictionary.july), i18n(dictionary.august), i18n(dictionary.september), i18n(dictionary.october), i18n(dictionary.november), i18n(dictionary.december)],
                datasets: [     
                  {
                    type: 'line',
                    label: i18n(i19quantity),
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#704975",
                    data: totalCountMonth
                  },
                  {
                    label: `${i18n(dictionary.usedCashback)} - ${year}`,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#00e679",
                    data: totalMoneyMonth
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
                      return `${yLabel} ${i18n(i19orders)}`
                    }
                  }
                }
              }
            })

            new Chart($('#anual-cashback'), {
              type: 'bar',
              data: {
                labels: [year],
                datasets: [     
                  {
                    type: 'bar',
                    label: i18n(i19quantity),
                    lineTension: 0,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#704975",
                    data: [totalCountYear]
                  },
                  {
                    label: i18n(dictionary.usedCashback),
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 0,
                    backgroundColor: "#00e679",
                    data: [totalMoneyYear]
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
                      return `${yLabel} ${i18n(i19orders)}`
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
              'transactions.loyalty_points': { 
                '$exists': true 
              }
            }
          },
          {
            $match: {
              created_at: {
                $gte: `${year}-01-01T03:00:00.000Z`
              }
            }
          },
          {
            $match: {
              created_at: {
                $lte: `${year + 1}-01-01T02:59:59.999Z`
              }
            }
          },
          {
            $unwind: '$transactions'
          },
          {
            $group: {
              _id: {
                $month: '$created_at'
              },
              count: {
                $sum: {
                  $cond: [
                    {
                      "$eq": [
                        "$financial_status.current",
                        "paid"
                      ]
                    },
                    1,
                    0
                  ]
                }
              },
              points: {
                $sum: {
                  $cond: [
                    {
                      "$eq": [
                        "$financial_status.current",
                        "paid"
                      ]
                    },
                    '$transactions.loyalty_points.points_value',
                    0
                  ]
                }
              },
              money: {
                $sum: {
                  $cond: [
                    {
                      "$eq": [
                        "$financial_status.current",
                        "paid"
                      ]
                    },
                    {
                      $multiply: [ '$transactions.loyalty_points.points_value', '$transactions.loyalty_points.ratio' ]
                    },
                    0
                  ]
                }
              }
            }
          },
          { 
            $sort: { 
              _id: 1 
            } 
          }
        ]
      }
    )
  }
  renderGraphByYear(currentYear, false)

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
    }
  });
  
  callApi(
    '$aggregate.json',
    'POST',
    (err, json) => {
      if (!err) {
        if (Array.isArray(json.result)) {
          const { result } = json
          const activePoints = result[0].active_points.toFixed(2)
          const earnedPoints = result[0].earned_points.toFixed(2)
          const usedPoints = earnedPoints - activePoints 
          const data = [earnedPoints, activePoints, usedPoints]
          new Chart($('#all-cashbacks'), {
            type: 'doughnut',
            data: {
              labels: [i18n(i19pointsEarned), i18n(dictionary.pointsActive), i18n(dictionary.pointsUsed)],
              datasets: [
                {
                  data: data,
                  backgroundColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    '#00e679'
                  ]
                }
              ]
            }
          })
        }
      }
    },
    {
      resource: 'customers',
      pipeline: [
        {
          $match: {
            'loyalty_points_entries': { 
              '$exists': true 
            }
          }
        },
        {
          $project: {
            _id: 0,
            activePoints: {
              $reduce: {
                input: '$loyalty_points_entries',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.active_points'] }
              }
            },
            activeMoney: {
              $reduce: {
                input: '$loyalty_points_entries',
                initialValue: 0,
                in: {
                   $add: {
                    $multiply: ['$$this.active_points', '$$this.ratio']
                   } 
                }
              }
            },
            earnedPoints: {
              $reduce: {
                input: '$loyalty_points_entries',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.earned_points'] }
              }
            },
            earnedMoney: {
              $reduce: {
                input: '$loyalty_points_entries',
                initialValue: 0,
                in: {
                   $add: {
                    $multiply: ['$$this.earned_points', '$$this.ratio']
                   } 
                }
              }
            }
          }
        }, {
          $group: {
            _id: "summary",
            active_points: { $sum: "$activePoints" },
            earned_points: { $sum: "$earnedPoints" },
            active_money: { $sum: "$activeMoney" },
            earned_money: { $sum: "$earnedMoney" }
          }
        }
      ]
    }
  )
}
