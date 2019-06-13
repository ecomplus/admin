/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'
  // lang of page
  var lang = window.lang
  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

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
    var today = new Date()
    var dd = today.getDate() - 1
    var mm = today.getMonth()
    var yyyy = today.getFullYear()
    var timezoneCalc = new Date().getTimezoneOffset()
    var totalAmount = 0
    var approved = 0
    var monthTotalPaid = 0
    var dataStart = new Date(yyyy, mm, dd, 0, -timezoneCalc, 0, 0).toISOString()
    console.log(dataStart)
    var dataEnd = new Date(yyyy, mm, dd, 23, 59 - timezoneCalc, 59, 0).toISOString()
    console.log(dataEnd)
    var dateStart = new Date(yyyy, mm, 1, 0, -timezoneCalc, 0, 0).toISOString()
    console.log(dateStart)
    var dateEnd = new Date(yyyy, mm, 31, 23, 59 - timezoneCalc, 59, 0).toISOString()
    console.log(dateEnd)
    var urlOrder = 'orders.json?sort=amount&created_at>=' + dataStart + '&created_at<=' + dataEnd
    var urlOrderMonth = 'orders.json?sort=amount&created_at>=' + dateStart + '&created_at<=' + dateEnd
    var arrayTable = []
    $storeID.text(storeId)
    var urlStore = 'stores/me.json'
    // var objMe = window.sessionStorage('meInfor') || []
    // search for store name and object id
    window.callApi(urlStore, 'GET', function (error, schema) {
      if (!error) {
        var storeName = schema.name
        $storeName.text(storeName)
        var __id = schema._id
        $storeobject.text(__id)
      }
    })
    // search for dayly orders
    $(document).ready(function () {
      setTimeout(function () {
        window.callApi(urlOrder, 'GET', function (err, json) {
          if (!err) {
            var totalOrders = json.result
            console.log(totalOrders)
            if (totalOrders.length === 0) {
              appTab.find('#cards-graphs-orders').hide()
            } else {
              for (var i = 0; i < totalOrders.length; i++) {
                if (totalOrders[i].financial_status) {
                  var tableOrder = totalOrders[i].financial_status.current
                  arrayTable.push(tableOrder)
                  for (var ii = 0; ii < arrayTable.length; ii++) {
                    if (arrayTable[ii] === 'paid') {
                      arrayTable[ii] = 'Pagamento Aprovado'
                    }
                    if (arrayTable[ii] === 'voided') {
                      arrayTable[ii] = 'Pagamento Cancelado'
                    }
                    if (arrayTable[ii] === 'pending') {
                      arrayTable[ii] = 'Pagamento Pendente'
                    }
                  }
                  if (i < 6) {
                    $order.append('<tr>' +
                    '  <th scope="row"><a href="/#/resources/orders/' + totalOrders[i]._id + ' ">' + totalOrders[i].number + ' </a></th>' +
                    '  <td>' + arrayTable[i] + '</td>' +
                    '  <td> R$ ' + totalOrders[i].amount.total.toFixed(2) + '</td>' +
                    '  <td><a href="/#/resources/customers/' + totalOrders[i].buyers[0]._id + ' ">' + totalOrders[i].buyers[0].display_name + ' </a></td>' +
                    '</tr>')
                  }
                  var statusOrder = totalOrders[i].financial_status.current
                  totalAmount = totalOrders[i].amount.total + totalAmount
                  $todayTotal.text(totalAmount.toFixed(2).replace('.', ','))
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
      }, 100)
    })
    // search for month orders
    $(document).ready(function () {
      setTimeout(function () {
        window.callApi(urlOrderMonth, 'GET', function (error, jsonMonth) {
          if (!error) {
            var monthOrders = jsonMonth.result
            for (var i = 0; i < monthOrders.length; i++) {
              if (monthOrders[i].financial_status) {
                var order = monthOrders.length
                if (monthOrders[i].financial_status.current === 'paid') {
                  monthTotalPaid = monthOrders[i].amount.total + monthTotalPaid
                  $monthTotal.text(monthTotalPaid.toFixed(2).replace('.', ','))
                  approved = approved + 1
                  var percentApproved = ((approved / order) * 100).toFixed(2)
                  $approve.text(percentApproved)
                }
              }
            }
          }
        })
      }, 500)
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
}())
