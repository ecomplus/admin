/*!
 * Copyright 2018 E-Com Club
 */

export default function () {
  'use strict'
  // current tab ID
  const { $, localStorage, tabId, Chart } = window
  var Tab = window.Tabs[tabId]
  // render cart items on table
  var setup = function () {
    var appTab = $('#app-tab-' + tabId)
    var countPending = 0
    var countPaid = 0
    var countCancelled = 0
    var $cardAmount = appTab.find('#cards-graphs-amount')
    var $todayTotal = $cardAmount.find('#dayAmount')
    var $storeInfo = appTab.find('#home-cards')
    var $storeName = $storeInfo.find('#home-name')
    var $storeobject = $storeInfo.find('#home-object')
    var $storeID = $storeInfo.find('#home-id')
    var storeId = localStorage.getItem('store_id')
    var $lastOrders = appTab.find('#lastOrders')
    var $order = $lastOrders.find('#addOrders')
    var $approve = appTab.find('#approved')
    var $monthTotal = appTab.find('#monthAmount')
    var $lastCardAmount = appTab.find('#cards-graphs-amount-last')
    var $lastApprove = appTab.find('#lastApproved')
    var $lastMonthTotal = appTab.find('#lastMonthAmount')
    var $lastTotal = $lastCardAmount.find('#lastDayAmount')
    var $monthTotalOrders = appTab.find('#monthTotalOrders')
    var $monthTotalOrdersApr = appTab.find('#monthTotalOrdersApproved')
    var $lastMonthTotalOrders = appTab.find('#lastMonthTotalOrders')
    var $lastMonthTotalOrdersApr = appTab.find('#lastMonthTotalOrdersApproved')
    var calcWithTimezone = function (timeZone) {
      if (timeZone < 0) {
        return -1 * timeZone
      } else {
        return timeZone
      }
    }
    var pad = function (number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    }
    var getISOWithLocalStart = function (date) {
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.000Z'
    }
    var getISOWithLocalEnd = function (date) {
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.999Z'
    }
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth()
    var yyyy = today.getFullYear()
    var timezoneCalc = calcWithTimezone(new Date().getTimezoneOffset())
    var dataStartYesterday = getISOWithLocalStart(new Date(yyyy, mm, dd - 1, 0, timezoneCalc, 0, 0))
    var dataEndYesterday = getISOWithLocalEnd(new Date(yyyy, mm, dd - 1, 23, 59 + timezoneCalc, 59, 0))
    var dateStartTwo = getISOWithLocalStart(new Date(yyyy, mm - 1, 1, 0, timezoneCalc, 0, 0))
    // var dateEndTwo = getISOWithLocalEnd(new Date(yyyy, mm - 1, 31, 23, 59 + timezoneCalc, 59, 0))
    var dataStart = getISOWithLocalStart(new Date(yyyy, mm, dd, 0, timezoneCalc, 0, 0))
    var dataEnd = getISOWithLocalEnd(new Date(yyyy, mm, dd, 23, 59 + timezoneCalc, 59, 0))
    var dateStart = getISOWithLocalStart(new Date(yyyy, mm, 1, 0, timezoneCalc, 0, 0))
    var dateEnd = getISOWithLocalEnd(new Date(yyyy, mm, 31, 23, 59 + timezoneCalc, 59, 0))

    var approved = 0
    var approvedLast = 0
    var urlOrderLastMonth = 'orders.json?sort=amount&created_at>=' + dateStartTwo + '&created_at<=' + dateStart + '&fields=amount,created_at,financial_status'
    var urlOrderMonth = 'orders.json?sort=amount&created_at>=' + dateStart + '&fields=buyers,amount,_id,created_at,financial_status,number'
    $storeID.text(storeId)
    var urlStore = 'stores/me.json'
    // search for store name and object id
    var sumOfAmount = function (a, b) {
      return {
        amount: {
          total: a.amount.total + b.amount.total
        }
      }
    }
    window.callApi(urlStore, 'GET', function (error, schema) {
      if (!error) {
        var storeName = schema.name
        $storeName.text(storeName)
        var __id = schema._id
        $storeobject.text(__id)
        localStorage.setItem('fromAddress', schema.address)
        localStorage.setItem('fromContact', schema.contact_phone)
        localStorage.setItem('fromName', schema.name)
        localStorage.setItem('fromCorporate', schema.corporate_name)
        localStorage.setItem('domain', schema.domain)
      }
    })
    // search for dayly orders
    $(document).ready(function () {
      setTimeout(function () {
        window.callApi(urlOrderMonth, 'GET', function (err, json) {
          if (!err) {
            var result = json.result

            var filteredToday = result.filter(function (item) {
              return item.created_at >= dataStart && item.created_at <= dataEnd
            })

            const filteredLast = result.filter(function (item) {
              return item.created_at >= dataStartYesterday && item.created_at <= dataEndYesterday
            })

            const filteredMonth = result.filter(function (item) {
              return item.created_at >= dateStart && item.created_at <= dateEnd
            })

            if (filteredMonth.length) {
              var filteredMonthPaid = filteredMonth.filter(function (paid) {
                if (paid.financial_status) {
                  return paid.financial_status.current === 'paid'
                }
              })
              if (filteredMonthPaid.length) {
                var monthAmount = filteredMonthPaid.reduce(sumOfAmount)
                $monthTotal.text(window.ecomUtils.formatMoney(monthAmount.amount.total, 'BRL'))
                var order = filteredMonth.length
                approved = filteredMonthPaid.length
                var percentApproved = ((approved / order) * 100).toFixed(2)
                $approve.text(percentApproved)
                $monthTotalOrders.text(order)
                $monthTotalOrdersApr.text(approved)
              }
            }
            if (filteredLast.length) {
              var amountLast = filteredLast.reduce(sumOfAmount)
              $lastTotal.text(window.ecomUtils.formatMoney(amountLast.amount.total, 'BRL'))
            }

            if (filteredToday.length) {
              const todayAmount = filteredToday.reduce(sumOfAmount)
              $todayTotal.text(window.ecomUtils.formatMoney(todayAmount.amount.total, 'BRL'))
              appTab.find('#cards-graphs-orders').show()
              for (var i = 0; i < filteredToday.length; i++) {
                if (filteredToday[i].financial_status) {
                  var orderInfo = []
                  orderInfo.push(filteredToday[i]._id, filteredToday[i].number, filteredToday[i].financial_status.current, filteredToday[i].amount.total.toFixed(2).replace('.', ','), filteredToday[i].buyers[0]._id, filteredToday[i].buyers[0].display_name)
                  switch (orderInfo[2]) {
                    case 'under_analysis':
                      orderInfo[2] = 'Em análise'
                      break
                    case 'authorized':
                      orderInfo[2] = 'Autorizado'
                      break
                    case 'pending':
                      orderInfo[2] = 'Pendente'
                      break
                    case 'refunded':
                      orderInfo[2] = 'Devolvido'
                      break
                    case 'paid':
                      orderInfo[2] = 'Aprovado'
                      break
                    case 'in_dispute':
                      orderInfo[2] = 'Disputa'
                      break
                    case 'voided':
                      orderInfo[2] = 'Cancelado'
                      break
                    case 'unauthorized':
                      orderInfo[2] = 'Não autorizado'
                      break
                    case 'partially_paid':
                      orderInfo[2] = 'Parcialmente Pago'
                      break
                    case 'partially_refunded':
                      orderInfo[2] = 'Parcialmente devolvido'
                      break
                    case 'unknown':
                      orderInfo[2] = 'Desconhecido'
                      break
                  }
                  $order.append('<tr>' +
                  '  <th scope="row"><a href="/#/resources/orders/' + orderInfo[0] + ' ">' + orderInfo[1] + ' </a></th>' +
                  '  <td>' + orderInfo[2] + '</td>' +
                  '  <td> R$ ' + orderInfo[3] + '</td>' +
                  '  <td><a href="/#/resources/customers/' + orderInfo[4] + ' ">' + orderInfo[5] + ' </a></td>' +
                  '</tr>')
                  var statusOrder = filteredToday[i].financial_status.current
                  if (statusOrder === 'paid') {
                    countPaid = countPaid + 1
                  }
                  if (statusOrder === 'voided') {
                    countCancelled = countCancelled + 1
                  }
                  if (statusOrder === 'pending') {
                    countPending = countPending + 1
                  }
                  bar(countPaid, countPending, countCancelled)
                } else {
                  i = i + 1
                }
              }
            }
          }
        })
        window.callApi(urlOrderLastMonth, 'GET', function (err, data) {
          if (!err) {
            const lastMonthData = data.result
            if (lastMonthData.length) {
              var filteredLastMonthPaid = lastMonthData.filter(function (paid) {
                if (paid.financial_status) {
                  return paid.financial_status.current === 'paid'
                }
              })
              if (filteredLastMonthPaid) {
                const lastMonthAmount = filteredLastMonthPaid.reduce(sumOfAmount)
                $lastMonthTotal.text(window.ecomUtils.formatMoney(lastMonthAmount.amount.total, 'BRL'))
                var orders = lastMonthData.length
                approvedLast = filteredLastMonthPaid.length
                var percentApprovedLast = ((approvedLast / orders) * 100).toFixed(2)
                $lastApprove.text(percentApprovedLast)
                $lastMonthTotalOrders.text(orders)
                $lastMonthTotalOrdersApr.text(approvedLast)
              }
            }
          }
        })
      }, 100)
    })
    var bar = function () {
      var ctx = document.getElementById('orderOfAll')
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Aprovados', 'Pendentes', 'Cancelados'],
          datasets: [{
            label: 'Pedidos',
            data: [countPaid, countPending, countCancelled],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}
