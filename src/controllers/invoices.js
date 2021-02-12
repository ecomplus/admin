import {
  i19additionalCost,
  i19additionalNotes,
  i19buyer,
  i19description,
  i19discount,
  i19discountCoupon,
  i19freight,
  i19order,
  i19paymentMethod,
  i19price,
  i19quantity,
  i19shippingMethod,
  i19subtotal,
  i19tax,
  i19total,
  i19zipCode
} from '@ecomplus/i18n'

import {
  i18n,
  fullName as getFullName,
  lineAddress as getLineAddress,
  price as getPrice,
  formatDate,
  formatMoney
} from '@ecomplus/utils'

import {
  formatCPF,
  formatCNPJ,
  formatCEP
} from '@brazilian-utils/brazilian-utils'

export default function () {
  const { $, app, ecomUtils, callApi, tabId, routeParams, formatPhone } = window

  const $appTab = $(`#app-tab-${tabId}`)
  const $invoices = $appTab.find('.invoices')
  const orderIds = routeParams[routeParams.length - 1]

  const renderInvoice = (store, order) => {
    const buyer = order.buyers && order.buyers[0]
    const shippingLine = order.shipping_lines && order.shipping_lines[0]
    const transaction = order.transactions && order.transactions[0]
    const { items } = order

    const $invoice = $('<div>', {
      class: 'mb-70 pb-3',
      style: 'border-bottom: 1px dashed #ccc; page-break-after: always; page-break-inside: avoid'
    }).html(`
      <div class="row align-items-center">
        <div class="col">
          <h3 class="fw-400">
            ${i18n(i19order)}
            <span class="text-monospace">#${order.number}</span>
          </h3>
        </div>

        <div class="col-auto">
          <div class="d-inline-block">
            <i class="ti-calendar mr-1"></i> ${formatDate(order.created_at)}
          </div>
          <div class="d-inline-block">
            ${(order.updated_at ? `<i class="ti-save ml-3 mr-1"></i> ${formatDate(order.updated_at)}` : '')}
          </div>
        </div>
      </div>

      <div class="row px-3 pt-4 fs-15">
        <div class="col-md-3">
          ${(store.logo ? `<img src="${store.logo.url}" class="mb-4">` : '')}
          <h4 class="fw-400">${(store.corporate_name || store.name)}</h4>
          ${store.doc_type}:
          <strong>
            ${store.doc_type === 'CNPJ' ? formatCNPJ(store.doc_number) : formatCPF(store.doc_number)}
          </strong>
          <br>
          ${(store.contact_email ? `${store.contact_email}<br>` : '')}
          ${(store.contact_phone ? formatPhone(ecomUtils.parsePhone(store.contact_phone)) : '')}
        </div>

        <div class="col-md-3 ml-md-auto text-md-right">
          <div class="fs-17">
            <span class="text-muted">${i18n(i19buyer)}:</span><br>
            <strong>${(buyer ? (buyer.corporate_name || getFullName(buyer)) : '')}</strong><br>
            ${(buyer
              ? buyer.registry_type === 'p'
                ? `CPF: ${formatCPF(buyer.doc_number)}`
                : `CNPJ: ${formatCNPJ(buyer.doc_number)}`
              : '')}
          </div>

          <div class="mt-3">
          ${(shippingLine
            ? `
            ${i18n(i19zipCode)}: ${formatCEP(shippingLine.to.zip)}<br>
            <address>${getLineAddress(shippingLine.to)}</address>`
            : '')}
            ${(buyer ? `${buyer.main_email}<br>` : '')}
            ${(buyer && buyer.phones ? buyer.phones.map(phone => formatPhone(phone)).join(' / ') : '')}
          </div>
        </div>
      </div>

      <hr>
      <div class="table-responsive mb-4">
        <table class="table table-hover">
          <thead>
            <tr class="text-muted">
              <th>#</th>
              <th>${i18n(i19description)}</th>
              <th>${i18n(i19quantity)}</th>
              <th>${i18n(i19price)}</th>
              <th>${i18n(i19total)}</th>
            </tr>
          </thead>
          <tbody>
            ${(items
              ? items.filter(item => item.quantity > 0).reduce((trsStr, item, i) => trsStr + `
                <tr>
                  <td>${(i + 1)}</td>
                  <td>${item.name} (${item.sku})
                  ${item.customizations
                    ? item.customizations.reduce((trs, custom, index) => trs +
                    `<br><em>${custom.label}</em>:<mark>${(custom.option ? custom.option.text : '')}</mark>`
                    , '')
                    : ''}
                  </td>
                  <td>${item.quantity}</td>
                  <td>${formatMoney(getPrice(item))}</td>
                  <td>${formatMoney(getPrice(item) * item.quantity)}</td>
                </tr>`, '')
              : '')}
          </tbody>
        </table>
      </div>

      <div class="row border-top py-4">
        <div class="col-md-6">
          ${(order.notes
            ? `<p><span class="text-muted">${i18n(i19additionalNotes)}</span>:<br>${order.notes}</p>`
            : '')}
          ${i18n(i19shippingMethod)}:
            <strong>${(shippingLine && shippingLine.app
              ? `${shippingLine.app.label} (${shippingLine.app.carrier})`
              : order.shipping_method_label)}</strong><br>
          ${i18n(i19paymentMethod)}:
            <strong>${(transaction && transaction.app
              ? transaction.app.label +
                (transaction.app.intermediator ? ` (${transaction.app.intermediator.name})` : '')
              : order.payment_method_label)}</strong><br>
          ${(order.extra_discount && order.extra_discount.discount_coupon
            ? `${i18n(i19discountCoupon)}: <strong>${order.extra_discount.discount_coupon}</strong>`
            : '')}
        </div>

        <div class="col-auto ml-auto text-right">
          <table class="table table-borderless table-sm" style="width: 300px">
            <tbody>
              <tr>
                <td>${i18n(i19subtotal)}</td>
                <td>${formatMoney(order.amount.subtotal || 0)}</td>
              </tr>
              <tr>
                <td>${i18n(i19freight)}</td>
                <td>${formatMoney(order.amount.freight || 0)}</td>
              </tr>
              <tr>
                <td>${i18n(i19discount)}</td>
                <td>${formatMoney(order.amount.discount || 0)}</td>
              </tr>
              <tr>
                <td>${i18n(i19tax)}</td>
                <td>${formatMoney(order.amount.tax || 0)}</td>
              </tr>
              <tr>
                <td>${i18n(i19additionalCost)}</td>
                <td>${formatMoney(order.amount.extra || 0)}</td>
              </tr>
            </tbody>
          </table>
          <div class="pr-2" style="color: #202020">
            <span class="fs-22">${i18n(i19total)}:</span>
            <strong class="fs-30 ml-2">${formatMoney(order.amount.total)}</strong>
          </div>
        </div>
      </div>`)

    $invoices.append($invoice)
    $invoice.fadeIn()
  }

  const ids = orderIds.split(',')
  if (ids.length) {
    let i = 0
    const getDoc = () => {
      if (i < ids.length) {
        callApi(`orders/${ids[i]}.json`, 'GET', (err, order) => {
          if (err) {
            console.error(err)
            app.toast()
          } else {
            renderInvoice(window.Store, order)
          }
          i++
          getDoc()
        })
      } else {
        $invoices.find('.loading').slideUp()
        $appTab.find('.shipping-tags').click(() => {
          window.location.href = `/#/shipping-tags/${orderIds}`
        })
      }
    }
    getDoc()
  }
}
