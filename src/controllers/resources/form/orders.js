/* eslint-disable no-var, quote-props, no-prototype-builtins */

export default function () {
  const {
    $,
    app,
    i18n,
    lang,
    tabId,
    routeParams,
    randomObjectId,
    formatMoney,
    formatDate,
    formatPhone,
    callApi,
    getFromDotNotation,
    handleNestedObjects
  } = window

  const { i19OrderStatus, i19subscriptions } = require('@ecomplus/i18n')

  // current tab ID
  var Tab = window.Tabs[tabId]
  // edit JSON document
  var commit = Tab.commit
  var Data = function () {
    // current data from global variable
    return Tab.data
  }

  const setup = function () {
    // setup basic order data
    const data = Data()
    const orderId = routeParams[routeParams.length - 1]

    const elContainer = $('#t' + tabId + '-tab-normal')
    elContainer.find('#t' + tabId + '-open-invoice').click(function () {
      window.location.href = '/#/invoices/' + orderId
    })
    elContainer.find('#t' + tabId + '-open-ticket').click(function () {
      window.location.href = '/#/shipping-tags/' + orderId
    })

    const $orderBase = $('#t' + tabId + '-order-base')

    $orderBase.find('#t' + tabId + '-switch-number').click(() => {
      const $input = $orderBase.find('input[name="number"]')
      if ($input.attr('readonly')) {
        $input.removeAttr('readonly')
      } else {
        $input.attr('readonly', true)
      }
    })

    // watch amount values
    const $amount = $orderBase.find('#t' + tabId + '-order-amount')
    const $total = $amount.find('input[name="amount.total"]')
    $amount.find('input:not([name="amount.total"])').change(function () {
      setTimeout(function () {
        // recalculate order total value
        var amount = Data().amount
        var total = (amount.subtotal || 0) + (amount.freight || 0) - (amount.discount || 0)
        if (amount.tax) {
          total += amount.tax
        }
        if (amount.balance) {
          total -= amount.balance
        }
        if (amount.extra) {
          total += amount.extra
        }
        // update amount total input value
        $total.val(formatMoney(total >= 0 ? total : 0)).trigger('change')
      }, 150)
    })

    /* handle amount extra fields collapse
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
    */

    // render buyers blocks
    const $buyers = $orderBase.find('#t' + tabId + '-order-buyers')
    const $buyerInfo = $buyers.find('#t' + tabId + '-buyer-info')
    // BUG: sometimes $buyers and $buyerInfo was empty
    // FIX: delay to fix bug
    setTimeout(function () {
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
      // basic info only: email, name, phone numbers, doc_number
      var html = ''
      var email = buyer.main_email
      if (email) {
        html += '<a href="mailto:' + email + '" target="_blank">' + email + '</a>'
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
          // parse phone number object to string
          var phone = formatPhone(buyer.phones[i])
          // digits only for link
          var tel = phone.replace(/\D/g, '')
          var cellphone
          if (lang === 'pt_br') {
            if (tel.length > 11) {
              cellphone = tel
            } else {
              cellphone = '55' + tel
            }
          } else {
            cellphone = '1' + tel
          }
          if ($(window).width() > 767) {
            html += '<a class="text-muted" href="https://web.whatsapp.com/send?1=pt_BR&phone=' + cellphone + '" target="_blank">' + phone + '</a>'
          } else {
            html += '<a class="text-muted" href="tel:' + tel + '" target="_blank">' + phone + '</a>'
          }
        }
      }

      // render doc number
      var docNumber = buyer.doc_number
      if (docNumber) {
        html += '<br>' + docNumber
      }

      // link to edit customer
      var $edit = $('<a>', {
        href: '#/resources/customers/' + objectId,
        html: '<i class="fa fa-pencil"></i> ' + i18n({
          en_us: 'edit registration',
          pt_br: 'editar cadastro'
        })
      })

      // icon to handle buyer delete from list
      var $remove = $('<i>', {
        class: 'p-10 remove fa fa-trash'
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
        class: 'hidden mb-3 nested-block',
        html: [$remove, '<div>' + html + '</div>', $edit]
      })
      $buyerInfo.append($div)
      $div.slideDown()
    }

    // handle new buyer
    var $newBuyer = $orderBase.find('#t' + tabId + '-new-buyer')
    var $addBuyerInput = $newBuyer.find('input')
    var buyerAdresses = []

    var addBuyer = function () {
      // show loading spinner
      $newBuyer.addClass('ajax')
      // search customer by main e-mail address
      // call Store API
      var uri = 'customers.json?main_email=' + encodeURIComponent($addBuyerInput.val().trim())
      // specify properties to return
      uri += '&fields=_id,main_email,doc_number,name,display_name,phones,addresses,registry_type'

      callApi(uri, 'GET', function (err, json) {
        // hide spinner
        $newBuyer.removeClass('ajax')
        if (!err) {
          var buyer = json.result[0]
          if (buyer) {
            // check if same customer is not already in buyers list
            var data = Data()
            if (!data.buyers) {
              data.buyers = []
            }
            var buyers = data.buyers
            for (var i = 0; i < buyers.length; i++) {
              if (buyers[i]._id === buyer._id) {
                app.toast(i18n({
                  en_us: 'This customer has already been added',
                  pt_br: 'Este cliente já foi adicionado'
                }))
                return
              }
            }

            // save customer addresses list
            if (!buyerAdresses.length && buyer.addresses) {
              buyerAdresses = buyer.addresses
            }
            // remove addresses from buyer object
            delete buyer.addresses

            // add customer to buyers
            buyers.push(buyer)
            // commit only to perform reactive actions
            commit(data, true)
            showBuyer(buyer)
          } else {
            // any customer found with email from input
            app.toast(i18n({
              en_us: 'No customers found with this email',
              pt_br: 'Nenhum cliente encontrado com este e-mail'
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
      $newBuyer.slideToggle().find('input')
      $addBuyerInput.val('').focus()
    })

    if (data.buyers && data.buyers.length) {
      // async GET the customer addresses to use as default on shipping lines
      // call Store API
      var uri = 'customers/' + data.buyers[0]._id + '.json'
      var skipError = true
      var callback = function (err, json) {
        if (!err) {
          // save customer addresses list (if defined)
          buyerAdresses = json.addresses || []
        }
      }
      callApi(uri, 'GET', callback, null, skipError)
    }

    // render subscriptions
    const $listOfSubscriptions = elContainer.find('#t' + tabId + '-invoices')
    if (orderId) {
      let url
      const data = Data()
      if (data.transactions[0].type === 'recurrence') {
        document.getElementById('subscription-invoices').style.display = 'block'
        url = `orders.json?subscription_order._id=${orderId}&fields=_id,number,status,amount,created_at`
        callApi(url, 'GET', (err, json) => {
          if (!err) {
            const orders = json.result
            $listOfSubscriptions.append(
              orders.reduce((trsStr, order, i) => trsStr + `
              <tr>
                <td>${(i + 1)}</td>
                <td><a href="/resources/orders/${order._id}">${order.number}</a></td>
                ${(order.status ? `<td>${i18n(i19OrderStatus)[order.status]}</td>` : '')}
                <td>${formatMoney(order.amount.total)}</td>
                <td>${formatDate(order.created_at)}</td>
              </tr>`, '')
            )
          }
        })
      } else if (data.subscription_order && data.subscription_order._id) {
        url = `orders.json?_id=${data.subscription_order._id}&limit=1&fields=_id,number`
        callApi(url, 'GET', (err, json) => {
          if (!err) {
            const order = json.result[0]
            $buyers.after(`
            <h4 class="mt-30"><a href="/resources/orders/${order._id}">${i18n(i19subscriptions)} #${order.number}</a></h4>
            `)
          }
        })
      }
    }
    // reuse order status enum and respective colors from lists configuration JSON
    import(/* webpackChunkName: "data_misc_config-lists" */ '@/data/misc/config-lists')
      .then(exp => {
        const json = exp.default
        // order status string fields
        var financialStatus = 'financial_status/current'
        var fulfillmentStatus = 'fulfillment_status/current'
        var fields = [
          'status',
          financialStatus,
          fulfillmentStatus
        ]
        var opts

        for (var i = 0; i < fields.length; i++) {
          var field = fields[i]
          var prop = field.replace('/', '.')
          var html = []
          opts = json.orders[field].enum

          // add options to HTML string
          for (var status in opts) {
            if (opts[status]) {
              html.push($('<option>', {
                value: status,
                text: status,
                'data-content': '<span class="text-' + opts[status].class + '">' +
                  i18n(opts[status].text) + '</span>'
              }))
            }
          }
          if (field !== 'status') {
            // add empty option
            html.unshift('<option value="" selected > -- </option>')
          }

          // update select element
          var $select = $orderBase.find('select[name="' + prop + '"]')
          $select.html(html)
          var value = getFromDotNotation(Data(), prop)
          if (value) {
            // set selected value
            $select.val(value)
          }
          $select.appSelectpicker('refresh')
        }

        // setup order timeline
        var $timeline = $('#t' + tabId + '-order-timeline')
        var events = []
        var eventTypes = {
          payments_history: financialStatus,
          fulfillments: fulfillmentStatus
        }

        // merge payment and fulfillment status changes
        for (var eventType in eventTypes) {
          if (eventTypes[eventType] && data[eventType]) {
            // get enum from JSON to set color and text by event
            opts = json.orders[eventTypes[eventType]].enum
            const sortedEntries = data[eventType].sort((a, b) => {
              if (a.date_time && b.date_time) {
                return a.date_time > b.date_time ? 1 : -1
              }
              return 0
            })

            sortedEntries.forEach(function (entry, index) {
              if (index > 0 && entry.status === sortedEntries[index - 1].status) {
                return
              }
              let eventObj
              for (var status in opts) {
                if (opts[status] && status === entry.status) {
                  // status found
                  eventObj = opts[status]
                  break
                }
              }
              if (eventObj) {
                events.push({
                  ...eventObj,
                  date_time: entry.date_time,
                  type: eventType
                })
              }
            })
          }
        }

        if (events.length) {
          // order events by date
          events.sort(function (a, b) {
            if (a.date_time > b.date_time) {
              return 1
            }
            if (a.date_time < b.date_time) {
              return -1
            }
            // a must be equal to b
            return 0
          })

          // update timeline element
          // show full timestamp of each event
          var dateList = ['day', 'month', 'year', 'hour', 'minute', 'second']
          events.forEach(function (eventObj) {
            // color by status
            var badgeColor = eventObj.class || 'default'
            // setup timeline block content
            var blockContent = ''
            if (eventObj.date_time) {
              blockContent += '<time datetime="' + eventObj.date_time + '">' +
                formatDate(eventObj.date_time, dateList) + '</time>'
            }
            blockContent += '<p>' + i18n(eventObj.text) + '</p>'

            // add block to timeline element
            $timeline.append($('<li>', {
              class: 'timeline-block',
              html: [
                $('<div>', {
                  class: 'timeline-point',
                  html: '<span class="badge badge-dot badge-lg badge-' + badgeColor + '"></span>'
                }),
                $('<div>', {
                  class: 'timeline-content',
                  html: blockContent
                })
              ]
            }))
          })

          // show timeline element on DOM
          $timeline.closest('.hidden').slideDown()
        }
      })
      .catch(console.error)

    // setup current transaction(s)
    var $payment = $('#t' + tabId + '-order-payment')
    handleNestedObjects(
      Data,
      commit,
      $payment,
      $('#t' + tabId + '-add-transaction'),
      $('#t' + tabId + '-delete-transaction'),
      $('#t' + tabId + '-next-transaction'),
      'transactions'
    )

    $payment.find('#t' + tabId + '-payment-method-code').change(function () {
      // update payment method name string
      var html = $(this).find('[selected]').data('content')
      if (html) {
        var transactionId = $(this).data('object-id')

        // set new label by current lang
        var label = $(html).children('[data-lang="' + lang + '"]').text()
        if (label) {
          var data = Data()
          for (var i = 0; i < data.transactions.length; i++) {
            var transaction = data.transactions[i]
            if (transaction._id === transactionId) {
              transaction.payment_method.name = label
              // commit only to perform reactive actions
              commit(data, true)
              break
            }
          }
        }
      }
    })

    // setup current transaction(s)
    var $shipping = $('#t' + tabId + '-order-shipping')
    var handleShippingObj = function (obj) {
      // preset a required (and hidden) from.zip field value
      obj.from = { zip: '00000000' }

      // preset shipping address with buyer address if defined
      var address
      if (buyerAdresses.length) {
        for (var i = 0; i < buyerAdresses.length; i++) {
          if (buyerAdresses[i].default) {
            // customer default shipping address
            address = buyerAdresses[i]
            break
          }
        }
        // use the first address on list
        if (!address) {
          address = buyerAdresses[0]
        }
      }
      obj.to = Object.assign({ zip: '00000000' }, address)

      // remove excedent properties
      delete obj.to.default
      delete obj.to._id
    }

    handleNestedObjects(
      Data,
      commit,
      $shipping,
      $('#t' + tabId + '-add-shipping'),
      $('#t' + tabId + '-delete-shipping'),
      $('#t' + tabId + '-next-shipping'),
      'shipping_lines',
      handleShippingObj
    )

    $('input[name="shipping_lines.app.carrier"],input[name="shipping_lines.app.carrier_doc_number"]')
      .change(function () {
        if ($(this).val()) {
          setTimeout(() => {
            const data = Data()
            data.shipping_lines.forEach(({ app }) => {
              if (app && !app._id) {
                app._id = randomObjectId()
                commit(data, true)
              }
            })
          }, 300)
        }
      })

    // handle collapse for payment address and shipping from address
    $('div[data-link-collapse]').each(function () {
      var $block = $(this)
      var $form = $block.children('div')
      var $em = $block.children('em')

      var resumeContent = function () {
        // show resumed content on text line
        var content = ''
        $form.find('input').each(function () {
          var text = $(this).val()
          if ((typeof text === 'string' && text.trim() !== '') || typeof text === 'number') {
            content += text + ', '
          }
        })
        // slice content to remove the last ', '
        $em.text(content.slice(0, -2))
      }

      $block.children('a').click(function () {
        $form.slideToggle('slow')
        resumeContent()
        $em.slideToggle()
      })
      // start the resumed content on em tag
      resumeContent()
    })
  }

  // wait for the form to be ready
  if (Tab.$form) {
    setup()
  } else {
    $(document).one('form-' + tabId, setup)
  }
}
