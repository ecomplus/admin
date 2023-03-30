import { i19orders, i19quantity, i19pointsEarned, i19name, i19email, i19phone } from '@ecomplus/i18n'
import { $ecomConfig, i18n, phone } from '@ecomplus/utils'
import Papa from 'papaparse'
import Chart from 'chart.js'

export default function () {
  const { $, callApi, tabId, formatMoney } = window

  const datatableOptions = {
    pageLength: 10
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
      info: 'Mostrando _START_ a _END_ de _TOTAL_ Clientes carregados',
      infoEmpty: '',
      infoFiltered: '',
      lengthMenu: 'Mostrar _MENU_ resultados',
      search: 'Buscar',
      zeroRecords: 'Nenhum resultado encontrado'
    }
  }
  const datatable = $('#cashback-clients-list').DataTable(datatableOptions)

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
                labels: [dictionary.january, dictionary.february, dictionary.march, dictionary.april, dictionary.may, dictionary.june, dictionary.july, dictionary.august, dictionary.september, dictionary.october, dictionary.november, dictionary.december],
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
              },
              clients: {
                $addToSet: {
                  id: '$_id',
                  name: {
                    $concat: [
                      '$name.given_name',
                      ' ',
                      '$name.family_name'
                    ]
                  },
                  day: '$birth_date.day',
                  email: '$main_email',
                  phones: '$phones'
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
        if (json && Array.isArray(json.result)) {
          const { result } = json
          const activePoints = result[0].active_points.toFixed(2)
          const earnedPoints = result[0].earned_points.toFixed(2)
          const usedPoints = (earnedPoints - activePoints).toFixed(2) 
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
          if (result && result.length && Array.isArray(result[0].clients)) {
            const { clients } = result[0]
            const size = clients.length
            if (datatableOptions.pageLength > 20) {
              datatableOptions.pageLength = size
            }
            const rows = []
            clients.forEach(client => {
              const phoneNumber = client.phones && client.phones.length && client.phones[0]
              rows.push([
                client.name,
                client.email,
                phoneNumber || 0,
                client.activePoints.toFixed(2),
                (client.earnedPoints - client.activePoints).toFixed(2)
              ])
            })
            datatable.clear()
            datatable.rows.add(rows)
            datatable.draw()
          }
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
            },
            name: {
              $concat: [
                '$name.given_name',
                ' ',
                '$name.family_name'
              ]
            },
            email: '$main_email',
            phone: '$phones.number'
          }
        }, {
          $group: {
            _id: "summary",
            active_points: { $sum: "$activePoints" },
            earned_points: { $sum: "$earnedPoints" },
            active_money: { $sum: "$activeMoney" },
            earned_money: { $sum: "$earnedMoney" },
            clients: {
              $addToSet: {
                id: '$_id',
                name: '$name',
                email: '$email',
                phones: '$phone',
                activePoints: '$activePoints',
                earnedPoints: '$earnedPoints'
              }
            }
          }
        }
      ]
    }
  )
  const $exportBirth = $('#export-cashback-clients')
  const downloadCsv = exportData => {
    const columns = [i18n(i19name), i18n(i19email), i18n(i19phone), dictionary.pointsActive, dictionary.pointsUsed]
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
    $link.setAttribute('download', 'export-cashback-clients.csv')
    $link.click()
  }
  $exportBirth.click(() => {
    downloadCsv(datatable.rows().data())
  })
}
