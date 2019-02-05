/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // current tab ID
  var tabId = window.tabId
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  var setup = function () {
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

    // render buyers blocks
    var $buyers, $buyerInfo
    // BUG: sometimes $buyers and $buyerInfo was empty
    // FIX: delay to fix bug
    setTimeout(function () {
      $buyers = $orderBase.find('#t' + tabId + '-order-buyers')
      $buyerInfo = $buyers.find('#t' + tabId + '-buyer-info')

      // show current buyers from list if any
      if (data.buyers) {
        for (var i = 0; i < data.buyers.length; i++) {
          showBuyer(data.buyers[i])
        }
      }
    }, 200)

    var showBuyer = function (buyer) {
      // show specific buyer info
      var objectId = buyer._id
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

      // icon to handle buyer delete from list
      var $remove = $('<i>', {
        'class': 'py-10 pr-10 remove fa fa-trash'
      }).click(function () {
        var data = Data()
        var buyers = data.buyers
        for (var i = 0; i < buyers.length; i++) {
          var buyer = buyers[i]
          if (buyer._id === objectId) {
            // remove buyer from list
            buyers.splice(i, 1)
            // commit only to perform reactive actions
            commit(data, true)
            break
          }
        }
        // remove block
        $div.slideUp(300, function () {
          $(this).remove()
        })
      })

      // create buyer block, append and show
      var $div = $('<div>', {
        'class': 'hidden mb-3',
        html: [ $remove, html ]
      })
      $buyerInfo.append($div)
      $div.slideDown()
    }
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
