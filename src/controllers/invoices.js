export default function () {
  const { $, app, ecomUtils, callApi, lang, tabId, routeParams, formatPhone } = window

  const $appTab = $(`#app-tab-${tabId}`)
  const $invoices = $appTab.find('.invoices')
  const invoiceModelHtml = $appTab.find('.invoice-model').html()
  const orderIds = routeParams[routeParams.length - 1]

  const renderInvoice = (store, order) => {
    const $invoice = $('<div>', {
      style: 'border-bottom: 2px dashed #ccc; display: none'
    }).html(invoiceModelHtml)

    var $invoiceId = $invoice.find('#invoice-id')
    var $toInfo = $invoice.find('#invoice-to')
    var $fromInfo = $invoice.find('#invoice-from')
    var $createdAt = $invoice.find('#createdAt')
    var $updatedAt = $invoice.find('#updatedAt')
    var $itemsOrder = $invoice.find('#itemsOrder')
    var $subTotalOrder = $invoice.find('#subTotalOrder')
    var $freightOrder = $invoice.find('#freightOrder')
    var $discountOrder = $invoice.find('#discountOrder')
    var $taxOrder = $invoice.find('#taxOrder')
    var $extraOrder = $invoice.find('#extraOrder')
    var $totalOrder = $invoice.find('#totalOrder')
    var $shippingMethod = $invoice.find('#shippingMethod')
    var $paymentMethod = $invoice.find('#paymentMethod')
    var $notes = $invoice.find('#noteOrder')
    var $coupon = $invoice.find('#coupon')

    var phoneFrom, docNumber
    var emailFrom = (store.contact_email) || ''
    if (store.contact_phone) {
      phoneFrom = formatPhone(ecomUtils.parsePhone(store.contact_phone))
    } else {
      phoneFrom = ''
    }
    if (store.doc_type === 'CNPJ') {
      docNumber = store.doc_number.replace(/(\d{2})(\d{3})(\d{3})\/(\d{4})(\d{2})/, '$1.$2.$3.$4-$5')
    } else {
      docNumber = store.doc_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    var corporateFrom = (store.corporate_name) || (store.name)
    if (store.logo.url) {
      var logo = store.logo.url
    }
    $fromInfo.append('<img src="' + logo + '"><br><br>' +
  '<strong>' + corporateFrom + '</strong><br>' +
  '<strong>' + store.doc_type + ' : ' + docNumber + '</strong><br>' +
  '<span>' + emailFrom + '</span> ' +
  '<br>' +
  '<span>' + phoneFrom + '</span> '
    )

    $createdAt.text(ecomUtils.formatDate(order.created_at))
    $updatedAt.text(ecomUtils.formatDate(order.updated_at) || 'Não houve atualização ainda')
    $invoiceId.text(order.number)
    var notes = order.staff_notes || order.notes || 'Nenhuma observação'
    $notes.text(notes)
    if (order.amount) {
      $subTotalOrder.text(ecomUtils.formatMoney(order.amount.subtotal, 'BRL', lang) || 'R$ 0,00')
      $freightOrder.text(ecomUtils.formatMoney(order.amount.freight, 'BRL', lang) || 'R$ 0,00')
      $discountOrder.text(ecomUtils.formatMoney(order.amount.discount, 'BRL', lang) || 'R$ 0,00')
      $extraOrder.text(ecomUtils.formatMoney(order.amount.extra, 'BRL', lang) || 'R$ 0,00')
      $taxOrder.text(ecomUtils.formatMoney(order.amount.tax, 'BRL', lang) || 'R$ 0,00')
      $totalOrder.text(ecomUtils.formatMoney(order.amount.total, 'BRL', lang))
    }
    if (order.items) {
      for (var i = 0; i < order.items.length; i++) {
        $itemsOrder.append('<tr><td>' + (i + 1) + '</td>' +
      '  <td>' + order.items[i].name + '/ (' + order.items[i].sku + ')</td>' +
      '  <td>' + order.items[i].quantity + '</td>' +
      '  <td>' + window.ecomUtils.formatMoney((order.items[i].final_price || order.items[i].price), (order.items[i].currency_id || 'BRL'), lang) + '</td>' +
      '  <td>' + window.ecomUtils.formatMoney(((order.items[i].final_price || order.items[i].price) * order.items[i].quantity), (order.items[i].currency_id || 'BRL'), lang) + '</td></tr>')
      }
    }
    $shippingMethod.text(order.shipping_method_label)
    if (order.transactions) {
      if (order.transactions[0].app) {
        if (order.transactions[0].app.intermediator) {
          $paymentMethod.text(order.transactions[0].app.intermediator.name)
        } else {
          $paymentMethod.text(order.transactions[0].app.label)
        }
      } else {
        $paymentMethod.text(order.payment_method_label)
      }
    }
    if (order.shipping_lines) {
      if (order.shipping_lines[0].app) {
        var shippingName = order.shipping_lines[0].app.carrier + ' | ' + order.shipping_lines[0].app.label
        $shippingMethod.text(shippingName)
      } else {
        $shippingMethod.text(order.shipping_method_label)
      }
    }
    if (order.extra_discount) {
      if (order.extra_discount.discount_coupon) {
        $coupon.text(order.extra_discount.discount_coupon)
      } else {
        $coupon.text('Outra forma de desconto')
      }
    } else {
      $coupon.text('Nenhum uso de cupom')
    }
    var nameCompany, documentClient, buyerDocNumber, emailCustomer, phonesCustomer
    if (order.buyers) {
      if (order.buyers[0].registry_type === 'p') {
        if (order.buyers[0].name.middle_name) {
          nameCompany = order.buyers[0].name.given_name + ' ' + order.buyers[0].name.middle_name + ' ' + order.buyers[0].name.family_name
        } else {
          nameCompany = order.buyers[0].name.given_name + ' ' + order.buyers[0].name.family_name
        }
        documentClient = 'CPF'
        buyerDocNumber = order.buyers[0].doc_number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      } else {
        nameCompany = order.buyers[0].corporate_name || order.buyers[0].name.given_name + ' ' + order.buyers[0].name.family_name
        documentClient = 'CNPJ'
        buyerDocNumber = order.buyers[0].doc_number.replace(/(\d{2})(\d{3})(\d{3})\/(\d{4})(\d{2})/, '$1.$2.$3.$4-$5')
      }
      emailCustomer = order.buyers[0].main_email
      if (order.buyers[0].phones) {
        if (order.buyers[0].phones.length > 1) {
          phonesCustomer = '<span>' + formatPhone(order.buyers[0].phones[0]) + '<br>' + formatPhone(order.buyers[0].phones[1]) + ' </span>'
        }
        if (order.buyers[0].phones.length === 1) {
          phonesCustomer = '<span>' + formatPhone(order.buyers[0].phones[0]) + ' </span>'
        }
      }
    }
    if (order.shipping_lines) {
      var addressToZip = order.shipping_lines[0].to.zip
      var addressFrom = (ecomUtils.lineAddress(order.shipping_lines[0].from)) || ''
      var addressTo = (ecomUtils.lineAddress(order.shipping_lines[0].to)) || ''
      var addressFromZip = order.shipping_lines[0].from.zip
    }
    $toInfo.append('<strong> ' + nameCompany + '</strong><br>' +
  '    <strong> ' + documentClient + ':' + buyerDocNumber + '</strong><br>' +
  '    <span>CEP: ' + addressToZip + '</span><br>' +
  '    <span>Endereço: ' + addressTo + '</span><br>' +
  '    <span>' + emailCustomer + '</span> ' +
  '    <br> ' +
  '    <span>' + phonesCustomer + '</span>'
    )
    setTimeout(function () {
      $fromInfo.append('<br>' +
        '<span> CEP: ' + addressFromZip + '</span><br>' +
        '    <span>' + addressFrom + '</span><br>'
      )
    }, 100)

    $invoices.append($invoice)
    $invoice.fadeIn()
  }

  const ids = orderIds.split(',')
  if (ids.length) {
    callApi('stores/me.json', 'GET', (err, store) => {
      if (err) {
        console.error(err)
        app.toast()
      } else {
        let i = 0
        const getDoc = () => {
          if (i < ids.length) {
            callApi(`orders/${ids[i]}.json`, 'GET', (err, order) => {
              if (err) {
                console.error(err)
                app.toast()
              } else {
                renderInvoice(store, order)
              }
              i++
              getDoc()
            })
          } else {
            $invoices.find('.loading').hide()
            $appTab.find('.shipping-tags').click(() => {
              window.location.href = `/#/shipping-tags/${orderIds}`
            })
          }
        }
        getDoc()
      }
    })
  }
}
