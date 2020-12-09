/*!
 * Copyright 2018 E-Com Club
 */

export default function () {
  'use strict'
  // current tab ID
  const { $, localStorage, tabId, Chart } = window
  const Tab = window.Tabs[tabId]
  // render cart items on table
  const setup = function () {
    const appTab = $('#app-tab-' + tabId)
    let countPending = 0
    let countPaid = 0
    let countCancelled = 0
    const $cardAmount = appTab.find('#cards-graphs-amount')
    const $todayTotal = $cardAmount.find('#dayAmount')
    const $storeInfo = appTab.find('#home-cards')
    const $storeName = $storeInfo.find('#home-name')
    const $storeLayout = $storeInfo.find('#home-layout')
    const $storeID = $storeInfo.find('#home-id')
    const storeId = localStorage.getItem('store_id')
    const $lastOrders = appTab.find('#lastOrders')
    const $order = $lastOrders.find('#addOrders')
    const $approve = appTab.find('#approved')
    const $monthTotal = appTab.find('#monthAmount')
    const $lastCardAmount = appTab.find('#cards-graphs-amount-last')
    const $lastApprove = appTab.find('#lastApproved')
    const $lastMonthTotal = appTab.find('#lastMonthAmount')
    const $lastTotal = $lastCardAmount.find('#lastDayAmount')
    const $monthTotalOrders = appTab.find('#monthTotalOrders')
    const $monthTotalOrdersApr = appTab.find('#monthTotalOrdersApproved')
    const $lastMonthTotalOrders = appTab.find('#lastMonthTotalOrders')
    const $lastMonthTotalOrdersApr = appTab.find('#lastMonthTotalOrdersApproved')
    const calcWithTimezone = (timeZone) => {
      if (timeZone < 0) {
        return -1 * timeZone
      } else {
        return timeZone
      }
    }
    const pad = (number) => {
      if (number < 10) {
        return '0' + number
      }
      return number
    }
    const getISOWithLocalStart = (date) => {
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.000Z'
    }
    const getISOWithLocalEnd = (date) => {
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.999Z'
    }
    const today = new Date()
    const dd = today.getDate()
    const mm = today.getMonth()
    const yyyy = today.getFullYear()
    const timezoneCalc = calcWithTimezone(new Date().getTimezoneOffset())
    const dataStartYesterday = getISOWithLocalStart(new Date(yyyy, mm, dd - 1, 0, timezoneCalc, 0, 0))
    const dataEndYesterday = getISOWithLocalEnd(new Date(yyyy, mm, dd - 1, 23, 59 + timezoneCalc, 59, 0))
    const dateStartTwo = getISOWithLocalStart(new Date(yyyy, mm - 1, 1, 0, timezoneCalc, 0, 0))
    // var dateEndTwo = getISOWithLocalEnd(new Date(yyyy, mm - 1, 31, 23, 59 + timezoneCalc, 59, 0))
    const dataStart = getISOWithLocalStart(new Date(yyyy, mm, dd, 0, timezoneCalc, 0, 0))
    const dataEnd = getISOWithLocalEnd(new Date(yyyy, mm, dd, 23, 59 + timezoneCalc, 59, 0))
    const dateStart = getISOWithLocalStart(new Date(yyyy, mm, 1, 0, timezoneCalc, 0, 0))
    const dateEnd = getISOWithLocalEnd(new Date(yyyy, mm, 31, 23, 59 + timezoneCalc, 59, 0))

    let approved = 0
    let approvedLast = 0
    const urlOrderLastMonth = 'orders.json?sort=amount&created_at>=' + dateStartTwo + '&created_at<=' + dateStart + '&fields=amount,created_at,financial_status'
    const urlOrderMonth = 'orders.json?sort=amount&created_at>=' + dateStart + '&fields=buyers,amount,_id,created_at,financial_status,number'
    $storeID.text(storeId)
    const urlStore = 'stores/me.json'
    // search for store name and object id
    const sumOfAmount = (a, b) => {
      return {
        amount: {
          total: a.amount.total + b.amount.total
        }
      }
    }
    window.callApi(urlStore, 'GET', function (error, schema) {
      if (!error) {
        const storeName = schema.name
        if (schema.homepage) {
          $storeLayout.append(
            '  <span data-lang="en_us"><a target="_blank" data-lang="en_us" href="' + schema.homepage + '/admin/">Edit layout store</a> | <a target="_blank" data-lang="en_us" href="' + schema.homepage + '">Access store</a></span>' +
            '  <span data-lang="pt_br"><a target="_blank" data-lang="pt_br" href="' + schema.homepage + '/admin/">Editar visual da loja</a> | <a target="_blank" data-lang="pt_br" href="' + schema.homepage + '">Acessar loja</a></span>'
          )
        } else {
          $storeLayout.append(
            '  <a href="/#/settings" data-lang="en_us">Set homepage url to edit your layout</a>' +
            '  <a href="/#/settings" data-lang="pt_br">Configure a url da loja para editar o layout</a>'
          )
        }
        $storeName.text(storeName)
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
            const result = json.result

            const filteredToday = result.filter(function (item) {
              return item.created_at >= dataStart && item.created_at <= dataEnd
            })

            const filteredLast = result.filter(function (item) {
              return item.created_at >= dataStartYesterday && item.created_at <= dataEndYesterday
            })

            const filteredMonth = result.filter(function (item) {
              return item.created_at >= dateStart && item.created_at <= dateEnd
            })

            if (filteredMonth.length) {
              const filteredMonthPaid = filteredMonth.filter(function (paid) {
                if (paid.financial_status && paid.financial_status.current === 'paid') {
                  return paid.financial_status.current === 'paid'
                }
              })
              if (filteredMonthPaid.length) {
                const monthAmount = filteredMonthPaid.reduce(sumOfAmount)
                $monthTotal.text(window.ecomUtils.formatMoney(monthAmount.amount.total, 'BRL'))
                const order = filteredMonth.length
                approved = filteredMonthPaid.length
                const percentApproved = ((approved / order) * 100).toFixed(2)
                $approve.text(percentApproved)
                $monthTotalOrders.text(order)
                $monthTotalOrdersApr.text(approved)
              }
            }
            if (filteredLast.length) {
              const amountLast = filteredLast.reduce(sumOfAmount)
              $lastTotal.text(window.ecomUtils.formatMoney(amountLast.amount.total, 'BRL'))
            }

            if (filteredToday.length) {
              appTab.find('#cards-graphs-orders').show()
              const todayAmount = filteredToday.reduce(sumOfAmount)
              $todayTotal.text(window.ecomUtils.formatMoney(todayAmount.amount.total, 'BRL'))
              for (let i = 0; i < filteredToday.length; i++) {
                if (filteredToday[i].financial_status) {
                  const orderInfo = []
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
                  const statusOrder = filteredToday[i].financial_status.current
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
              const filteredLastMonthPaid = lastMonthData.filter(function (paid) {
                if (paid.financial_status) {
                  return paid.financial_status.current === 'paid'
                }
              })
              if (filteredLastMonthPaid) {
                const lastMonthAmount = filteredLastMonthPaid.reduce(sumOfAmount)
                $lastMonthTotal.text(window.ecomUtils.formatMoney(lastMonthAmount.amount.total, 'BRL'))
                const orders = lastMonthData.length
                approvedLast = filteredLastMonthPaid.length
                const percentApprovedLast = ((approvedLast / orders) * 100).toFixed(2)
                $lastApprove.text(percentApprovedLast)
                $lastMonthTotalOrders.text(orders)
                $lastMonthTotalOrdersApr.text(approvedLast)
              }
            }
          }
        })
      }, 100)
    })
    const bar = function () {
      const ctx = document.getElementById('orderOfAll')
      const myChart = new Chart(ctx, {
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
