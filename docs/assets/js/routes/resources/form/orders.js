/*!
 * Copyright 2018 E-Com Club
 */

(function () {
  'use strict'

  // var lang = window.lang
  var i18n = window.i18n

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
        if (buyer.phones.length) {
          html += '<br>'
        }
        for (var i = 0; i < buyer.phones.length; i++) {
          if (i > 0) {
            html += ' / '
          }
          html += '<span class="text-muted">' + buyer.phones[i].number + '</span>'
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

    // handle new buyer
    var $newBuyer = $orderBase.find('#t' + tabId + '-new-buyer')
    var $addBuyerInput = $newBuyer.find('input')

    var addBuyer = function () {
      // show loading spinner
      $newBuyer.addClass('ajax')
      // search customer by main e-mail address
      // call Store API
      var uri = 'customers.json?main_email=' + encodeURIComponent($addBuyerInput.val().trim())
      // specify properties to return
      uri += '&fields=_id,main_email,name,display_name,phones'

      window.callApi(uri, 'GET', function (err, json) {
        // hide spinner
        $newBuyer.removeClass('ajax')
        if (!err) {
          var buyer = json.result[0]
          if (buyer) {
            // check if same customer is not already in buyers list
            var data = Data()
            var buyers = data.buyers
            for (var i = 0; i < buyers.length; i++) {
              if (buyers[i]._id === buyer._id) {
                app.toast(i18n({
                  'en_us': 'This customer has already been added',
                  'pt_br': 'Este cliente já foi adicionado'
                }))
                return
              }
            }

            // add customer to buyers
            buyers.push(buyer)
            // commit only to perform reactive actions
            commit(data, true)
            showBuyer(buyer)
          } else {
            // any customer found with email from input
            app.toast(i18n({
              'en_us': 'No customers found with this email',
              'pt_br': 'Nenhum cliente encontrado com este e-mail'
            }))
          }
        }
      })
    }

    $addBuyerInput.click(function () {
      $(this).select()
    }).keydown(function (e) {
      switch (e.which) {
        // enter
        case 13:
          // do not submit form
          e.preventDefault()
          addBuyer()
          break
      }
    })
    $newBuyer.find('button').click(addBuyer)
    $orderBase.find('#t' + tabId + '-add-buyer').click(function () {
      // clear the input and show new buyer block
      $addBuyerInput.val('')
      $newBuyer.slideToggle()
    })

    // reuse order status enum and respective colors from lists configuration JSON
    $.getJSON('json/misc/config_lists.json', function (json) {
      // order status string fields
      var fields = [
        'status',
        'financial_status/current',
        'fulfillment_status/current'
      ]
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i]
        var prop = field.replace('/', '.')
        var html = []
        var opts = json.orders[field].enum

        // add options to HTML string
        for (var status in opts) {
          if (opts.hasOwnProperty(status)) {
            html.push($('<option>', {
              value: status,
              text: status,
              'data-content': '<span class="text-' + opts[status].class + '">' +
                i18n(opts[status].text) + '</span>'
            }))
          }
        }

        // update select element
        var $select = $orderBase.find('select[name="' + prop + '"]')
        $select.html(html)
        var value = getFromDotNotation(Data(), prop)
        if (value) {
          // set selected value
          $select.val(value)
        }
        $select.selectpicker('refresh')
      }
    })
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}())
