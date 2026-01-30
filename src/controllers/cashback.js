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
    }),
    pointsExpired: i18n({
      en_us: 'Expired points',
      pt_br: 'Pontos expirados'
    }),
    pointsExpiringSoon: i18n({
      en_us: 'Points expiring soon',
      pt_br: 'Pontos expirando em breve'
    }),
    expirationDate: i18n({
      en_us: 'Expiration date',
      pt_br: 'Data de expiração'
    }),
    next30Days: i18n({
      en_us: 'Next 30 days',
      pt_br: 'Próximos 30 dias'
    }),
    next60Days: i18n({
      en_us: 'Next 60 days',
      pt_br: 'Próximos 60 dias'
    }),
    next90Days: i18n({
      en_us: 'Next 90 days',
      pt_br: 'Próximos 90 dias'
    })
  }

  // Get cashback from year
  const currentYear = new Date().getFullYear()
  
  const orderCountLabel = i18n({
    en_us: 'Orders that earned points',
    pt_br: 'Pedidos que geraram pontos'
  })

  let chartYear = null
  let chartAnual = null

  const renderGraphByYear = (year, change) => {
    const currentDate = new Date().toISOString()
    // Arrays for 12 months
    const earnedMonth = Array(12).fill(0)
    const usedMonth = Array(12).fill(0)
    const expiredMonth = Array(12).fill(0)
    const countMonth = Array(12).fill(0)
    let pending = 2

    const buildCharts = () => {
      pending--
      if (pending > 0) return

      if (chartYear) {
        chartYear.destroy()
        chartYear = null
      }
      if (chartAnual) {
        chartAnual.destroy()
        chartAnual = null
      }

      const earnedMonthStr = earnedMonth.map(v => v.toFixed(2))
      const usedMonthStr = usedMonth.map(v => v.toFixed(2))
      const expiredMonthStr = expiredMonth.map(v => v.toFixed(2))

      const totalEarnedYear = earnedMonth.reduce((a, b) => a + b, 0)
      const totalUsedYear = usedMonth.reduce((a, b) => a + b, 0)
      const totalExpiredYear = expiredMonth.reduce((a, b) => a + b, 0)
      const totalCountYear = countMonth.reduce((a, b) => a + b, 0)

      chartYear = new Chart($('#cashback-year'), {
        type: 'bar',
        data: {
          labels: [dictionary.january, dictionary.february, dictionary.march, dictionary.april, dictionary.may, dictionary.june, dictionary.july, dictionary.august, dictionary.september, dictionary.october, dictionary.november, dictionary.december],
          datasets: [
            {
              type: 'line',
              label: orderCountLabel,
              lineTension: 0,
              fill: false,
              borderWidth: 3,
              pointRadius: 0,
              backgroundColor: '#704975',
              borderColor: '#704975',
              data: countMonth
            },
            {
              label: `${i18n(i19pointsEarned)} - ${year}`,
              backgroundColor: '#00e679',
              data: earnedMonthStr
            },
            {
              label: `${i18n(dictionary.pointsUsed)} - ${year}`,
              backgroundColor: 'rgba(54, 162, 235, 1)',
              data: usedMonthStr
            },
            {
              label: `${i18n(dictionary.pointsExpired)} - ${year}`,
              backgroundColor: 'rgba(128, 128, 128, 1)',
              data: expiredMonthStr
            }
          ]
        },
        options: {
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: ({ yLabel, datasetIndex }) => {
                if (datasetIndex === 0) {
                  return `${yLabel} ${i18n(i19orders)}`
                }
                return formatMoney(yLabel)
              }
            }
          }
        }
      })

      chartAnual = new Chart($('#anual-cashback'), {
        type: 'bar',
        data: {
          labels: [year],
          datasets: [
            {
              type: 'bar',
              label: orderCountLabel,
              backgroundColor: '#704975',
              data: [totalCountYear]
            },
            {
              label: i18n(i19pointsEarned),
              backgroundColor: '#00e679',
              data: [totalEarnedYear.toFixed(2)]
            },
            {
              label: i18n(dictionary.pointsUsed),
              backgroundColor: 'rgba(54, 162, 235, 1)',
              data: [totalUsedYear.toFixed(2)]
            },
            {
              label: i18n(dictionary.pointsExpired),
              backgroundColor: 'rgba(128, 128, 128, 1)',
              data: [totalExpiredYear.toFixed(2)]
            }
          ]
        },
        options: {
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: ({ yLabel, datasetIndex }) => {
                if (datasetIndex === 0) {
                  return `${yLabel} ${i18n(i19orders)}`
                }
                return formatMoney(yLabel)
              }
            }
          }
        }
      })
    }

    // Call 1: Orders - earned points and used balance per month
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err && json && Array.isArray(json.result)) {
          json.result.forEach(month => {
            const idx = month._id - 1
            if (idx >= 0 && idx < 12) {
              earnedMonth[idx] = month.earned || 0
              usedMonth[idx] = month.used || 0
              countMonth[idx] = month.count || 0
            }
          })
        }
        buildCharts()
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
                    { '$eq': ['$financial_status.current', 'paid'] },
                    1,
                    0
                  ]
                }
              },
              earned: {
                $sum: {
                  $cond: [
                    { '$eq': ['$financial_status.current', 'paid'] },
                    { $multiply: ['$transactions.loyalty_points.points_value', '$transactions.loyalty_points.ratio'] },
                    0
                  ]
                }
              },
              used: {
                $sum: {
                  $cond: [
                    { '$eq': ['$financial_status.current', 'paid'] },
                    { $ifNull: ['$amount.balance', 0] },
                    0
                  ]
                }
              }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]
      }
    )

    // Call 2: Customers - expired points grouped by expiration month
    callApi(
      '$aggregate.json',
      'POST',
      (err, json) => {
        if (!err && json && Array.isArray(json.result)) {
          json.result.forEach(month => {
            const idx = parseInt(month._id, 10) - 1
            if (idx >= 0 && idx < 12) {
              expiredMonth[idx] = month.expired || 0
            }
          })
        }
        buildCharts()
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
            $unwind: '$loyalty_points_entries'
          },
          {
            $match: {
              'loyalty_points_entries.valid_thru': {
                $gte: `${year}-01-01T00:00:00.000Z`,
                $lte: `${year}-12-31T23:59:59.999Z`,
                $lt: currentDate
              }
            }
          },
          {
            $group: {
              _id: {
                $substr: ['$loyalty_points_entries.valid_thru', 5, 2]
              },
              expired: {
                $sum: {
                  $multiply: ['$loyalty_points_entries.active_points', '$loyalty_points_entries.ratio']
                }
              }
            }
          },
          {
            $sort: { _id: 1 }
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
  
  // Build pipeline with current date embedded
  const buildCustomersPipeline = () => {
    const currentDate = new Date().toISOString()
    return [
      {
        $match: {
          'loyalty_points_entries': { 
            '$exists': true 
          }
        }
      },
        {
          $project: {
            _id: 1,
            activePoints: {
            $reduce: {
              input: {
                $filter: {
                  input: '$loyalty_points_entries',
                  as: 'entry',
                  cond: {
                    $or: [
                      { $eq: [{ $ifNull: ['$$entry.valid_thru', null] }, null] },
                      { $gte: ['$$entry.valid_thru', currentDate] }
                    ]
                  }
                }
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this.active_points'] }
            }
          },
          activeMoney: {
            $reduce: {
              input: {
                $filter: {
                  input: '$loyalty_points_entries',
                  as: 'entry',
                  cond: {
                    $or: [
                      { $eq: [{ $ifNull: ['$$entry.valid_thru', null] }, null] },
                      { $gte: ['$$entry.valid_thru', currentDate] }
                    ]
                  }
                }
              },
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
          expiredPoints: {
            $reduce: {
              input: {
                $filter: {
                  input: '$loyalty_points_entries',
                  as: 'entry',
                  cond: {
                    $and: [
                      { $ne: [{ $ifNull: ['$$entry.valid_thru', null] }, null] },
                      { $lt: ['$$entry.valid_thru', currentDate] }
                    ]
                  }
                }
              },
              initialValue: 0,
              in: { $add: ['$$value', '$$this.active_points'] }
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
          expired_points: { $sum: "$expiredPoints" },
          clients: {
            $addToSet: {
              id: '$_id',
              name: '$name',
              email: '$email',
              phones: '$phone',
              activePoints: '$activePoints',
              earnedPoints: '$earnedPoints',
              expiredPoints: '$expiredPoints'
            }
          }
        }
      }
    ]
  }
  
  callApi(
    '$aggregate.json',
    'POST',
    (err, json) => {
      if (!err) {
        if (json && Array.isArray(json.result)) {
          const { result } = json
          const activePoints = result[0].active_points.toFixed(2)
          const earnedPoints = result[0].earned_points.toFixed(2)
          const expiredPoints = (result[0].expired_points || 0).toFixed(2)
          const usedPoints = (earnedPoints - activePoints - expiredPoints).toFixed(2) 
          const data = [earnedPoints, activePoints, usedPoints, expiredPoints]
          new Chart($('#all-cashbacks'), {
            type: 'doughnut',
            data: {
              labels: [i18n(i19pointsEarned), i18n(dictionary.pointsActive), i18n(dictionary.pointsUsed), i18n(dictionary.pointsExpired)],
              datasets: [
                {
                  data: data,
                  backgroundColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    '#00e679',
                    'rgba(128, 128, 128, 1)'
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
              // Used points = earned - active - expired (if expiredPoints is available)
              const usedPoints = client.expiredPoints !== undefined
                ? (client.earnedPoints - client.activePoints - client.expiredPoints).toFixed(2)
                : (client.earnedPoints - client.activePoints).toFixed(2)
              const expiredPoints = client.expiredPoints ? client.expiredPoints.toFixed(2) : '0.00'
              rows.push([
                client.name,
                client.email,
                phoneNumber || 0,
                client.activePoints.toFixed(2),
                usedPoints,
                expiredPoints
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
      pipeline: buildCustomersPipeline()
    }
  )
  const $exportBirth = $('#export-cashback-clients')
  const downloadCsv = exportData => {
    const columns = [i18n(i19name), i18n(i19email), i18n(i19phone), dictionary.pointsActive, dictionary.pointsUsed, dictionary.pointsExpired]
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

  // Expiration timeline and detailed tracking
  const datatableExpiringOptions = {
    pageLength: 10,
    order: [[3, 'asc']]
  }
  if ($ecomConfig.get('lang') === 'pt_br') {
    datatableExpiringOptions.language = datatableOptions.language
  }
  const datatableExpiring = $('#expiring-points-list').DataTable(datatableExpiringOptions)

  // Build pipeline for expiring points details
  const buildExpiringPointsPipeline = () => {
    const currentDate = new Date().toISOString()
    const next90Days = new Date()
    next90Days.setDate(next90Days.getDate() + 90)

    return [
      {
        $match: {
          'loyalty_points_entries': {
            '$exists': true
          }
        }
      },
      {
        $unwind: '$loyalty_points_entries'
      },
      {
        $match: {
          'loyalty_points_entries.valid_thru': {
            $exists: true,
            $ne: null,
            $gte: currentDate,
            $lte: next90Days.toISOString()
          },
          'loyalty_points_entries.active_points': {
            $gt: 0
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: {
            $concat: [
              '$name.given_name',
              ' ',
              '$name.family_name'
            ]
          },
          email: '$main_email',
          phone: { $arrayElemAt: ['$phones.number', 0] },
          points: '$loyalty_points_entries.active_points',
          earnedPoints: '$loyalty_points_entries.earned_points',
          ratio: '$loyalty_points_entries.ratio',
          validThru: '$loyalty_points_entries.valid_thru',
          orderId: '$loyalty_points_entries.order_id'
        }
      },
      {
        $sort: {
          validThru: 1
        }
      }
    ]
  }

  // Fetch expiring points details
  callApi(
    '$aggregate.json',
    'POST',
    (err, json) => {
      if (!err && json && Array.isArray(json.result)) {
        const expiringEntries = json.result

        // Populate expiring points table
        const rows = []
        expiringEntries.forEach(entry => {
          const expirationDate = new Date(entry.validThru)
          const daysUntilExpiry = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24))
          const moneyValue = (entry.points * entry.ratio).toFixed(2)

          rows.push([
            entry.name,
            entry.email,
            entry.phone || '-',
            expirationDate.toLocaleDateString(),
            `${daysUntilExpiry} ${i18n({ en_us: 'days', pt_br: 'dias' })}`,
            entry.points.toFixed(2),
            formatMoney(moneyValue)
          ])
        })

        datatableExpiring.clear()
        datatableExpiring.rows.add(rows)
        datatableExpiring.draw()

        // Calculate expiration timeline data
        const now = new Date()
        const monthlyExpiration = {}

        for (let i = 0; i < 12; i++) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
          const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
          monthlyExpiration[monthKey] = { points: 0, money: 0, count: 0 }
        }

        expiringEntries.forEach(entry => {
          const expDate = new Date(entry.validThru)
          const monthKey = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`

          if (monthlyExpiration[monthKey]) {
            monthlyExpiration[monthKey].points += entry.points
            monthlyExpiration[monthKey].money += entry.points * entry.ratio
            monthlyExpiration[monthKey].count += 1
          }
        })

        const labels = []
        const pointsData = []
        const moneyData = []
        const countData = []

        Object.keys(monthlyExpiration).sort().forEach(monthKey => {
          const [year, month] = monthKey.split('-')
          const monthNames = [
            dictionary.january, dictionary.february, dictionary.march,
            dictionary.april, dictionary.may, dictionary.june,
            dictionary.july, dictionary.august, dictionary.september,
            dictionary.october, dictionary.november, dictionary.december
          ]
          labels.push(`${monthNames[parseInt(month) - 1]} ${year}`)
          pointsData.push(monthlyExpiration[monthKey].points.toFixed(2))
          moneyData.push(monthlyExpiration[monthKey].money.toFixed(2))
          countData.push(monthlyExpiration[monthKey].count)
        })

        // Create expiration timeline chart
        new Chart($('#expiration-timeline'), {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                type: 'line',
                label: i18n({ en_us: 'Entries count', pt_br: 'Quantidade de registros' }),
                lineTension: 0,
                fill: false,
                borderWidth: 3,
                pointRadius: 4,
                backgroundColor: '#ff6384',
                borderColor: '#ff6384',
                data: countData,
                yAxisID: 'y-axis-count'
              },
              {
                label: i18n({ en_us: 'Expiring points', pt_br: 'Pontos expirando' }),
                backgroundColor: '#ffa500',
                data: pointsData,
                yAxisID: 'y-axis-points'
              }
            ]
          },
          options: {
            scales: {
              yAxes: [
                {
                  id: 'y-axis-points',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    beginAtZero: true
                  }
                },
                {
                  id: 'y-axis-count',
                  type: 'linear',
                  position: 'right',
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1
                  },
                  gridLines: {
                    drawOnChartArea: false
                  }
                }
              ]
            },
            tooltips: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (tooltipItem, data) => {
                  const datasetLabel = data.datasets[tooltipItem.datasetIndex].label
                  if (tooltipItem.datasetIndex === 0) {
                    return `${datasetLabel}: ${tooltipItem.yLabel}`
                  }
                  return `${datasetLabel}: ${tooltipItem.yLabel}`
                }
              }
            }
          }
        })

        // Calculate summary stats for expiring points
        const next30 = new Date()
        next30.setDate(next30.getDate() + 30)
        const next60 = new Date()
        next60.setDate(next60.getDate() + 60)
        const next90 = new Date()
        next90.setDate(next90.getDate() + 90)

        let points30 = 0, points60 = 0, points90 = 0
        let money30 = 0, money60 = 0, money90 = 0

        expiringEntries.forEach(entry => {
          const expDate = new Date(entry.validThru)
          const points = entry.points
          const money = points * entry.ratio

          if (expDate <= next30) {
            points30 += points
            money30 += money
          }
          if (expDate <= next60) {
            points60 += points
            money60 += money
          }
          if (expDate <= next90) {
            points90 += points
            money90 += money
          }
        })

        // Create expiring summary chart
        new Chart($('#expiring-summary'), {
          type: 'horizontalBar',
          data: {
            labels: [dictionary.next30Days, dictionary.next60Days, dictionary.next90Days],
            datasets: [
              {
                label: i18n(dictionary.pointsExpiringSoon),
                backgroundColor: ['#ff6384', '#ffa500', '#ffcd56'],
                data: [points30.toFixed(2), points60.toFixed(2), points90.toFixed(2)]
              }
            ]
          },
          options: {
            scales: {
              xAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.xLabel} ${i18n({ en_us: 'points', pt_br: 'pontos' })}`
                }
              }
            }
          }
        })

        // Update summary info
        $('#expiring-30-days').text(points30.toFixed(2))
        $('#expiring-30-days-money').text(formatMoney(money30.toFixed(2)))
        $('#expiring-60-days').text(points60.toFixed(2))
        $('#expiring-60-days-money').text(formatMoney(money60.toFixed(2)))
        $('#expiring-90-days').text(points90.toFixed(2))
        $('#expiring-90-days-money').text(formatMoney(money90.toFixed(2)))
      }
    },
    {
      resource: 'customers',
      pipeline: buildExpiringPointsPipeline()
    }
  )

  // Export expiring points CSV
  const $exportExpiring = $('#export-expiring-points')
  $exportExpiring.click(() => {
    const columns = [
      i18n(i19name),
      i18n(i19email),
      i18n(i19phone),
      dictionary.expirationDate,
      i18n({ en_us: 'Days until expiry', pt_br: 'Dias até expirar' }),
      i18n({ en_us: 'Points', pt_br: 'Pontos' }),
      i18n({ en_us: 'Value', pt_br: 'Valor' })
    ]
    const csv = Papa.unparse({
      data: datatableExpiring.rows().data(),
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
    $link.setAttribute('download', 'export-expiring-points.csv')
    $link.click()
  })
}
