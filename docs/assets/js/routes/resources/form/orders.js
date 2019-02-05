/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  // var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  // setup basic order data
  var data = Data()
  var $orderBase = $('#t' + tabId + '-order-base')

  // watch amount values
  var $amount = $orderBase.find('#t' + tabId + '-order-amount')
  var $total = $amount.find('input[name="amount.total"]')
  $amount.find('input:not([name="amount.total"])').change(function () {
    setTimeout(function () {
      // recalculate order total value
      var amount = Data().amount
      var total = (amount.subtotal || 0) + (amount.freight || 0) - (amount.discount || 0)
      if (amount.tax) {
        total += amount.tax
      }
      if (amount.extra) {
        total += amount.extra
      }
      // update amount total input value
      $total.val(formatMoney(total >= 0 ? total : 0)).trigger('change')
    }, 150)
  })

  // handle amount extra fields collapse
  var $amountExtra = $amount.find('#t' + tabId + '-extra-amount')
  var toggleAmountExtra = function () {
    $amountExtra.children('div').slideToggle()
  }
  $amountExtra.children('a').click(toggleAmountExtra)
  if (data.amount) {
    if (data.amount.tax || data.amount.extra) {
      toggleAmountExtra()
    }
  }

  // render buyers block
  var $buyers = $orderBase.find('#t' + tabId + '-order-buyers')
  var $buyerInfo = $buyers.find('#t' + tabId + '-buyer-info')

  var showBuyer = function (index) {
    // show specific buyer info from buyers list
    $buyerInfo.slideUp(400, function () {
      var buyer = Data().buyers[index]
      // basic info only: email, name, phone numbers
      var html = ''
      if (buyer.main_email) {
        html += '<a href="mailto:' + buyer.main_email + '" target="_blank">' + buyer.main_email + '</a>'
      }

      // full name and nickname
      var name
      if (buyer.name) {
        name = buyer.name.given_name
        if (buyer.name.middle_name) {
          name += ' ' + buyer.name.middle_name
        }
        if (buyer.name.family_name) {
          name += ' ' + buyer.name.family_name
        }
        if (buyer.display_name) {
          name += ' (' + buyer.display_name + ')'
        }
      } else if (buyer.display_name) {
        name = buyer.display_name
      }
      if (name) {
        html += '<br>' + name
      }

      // render list of phone numbers
      if (buyer.phones) {
        for (var i = 0; i < buyer.phones.length; i++) {
          html += '<br><span class="text-muted">' + buyer.phones[i].number + '</span>'
        }
      }

      // update block HTML and show again
      $(this).html(html).slideDown()
    })
  }

  // show the first buyer if any
  if (data.buyers && data.buyers.length) {
    showBuyer(0)
  }
}())
