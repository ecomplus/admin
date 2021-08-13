import { price as getPrice, formatMoney, formatDate } from '@ecomplus/utils'

const { $, callApi } = window

export default function (tabId) {
  const listProductOrders = () => {
    const { resourceId, data } = window.Tabs[tabId]
    const isKit = data.kit_composition && data.kit_composition.length
    const itemsQuery = `items.${(isKit ? 'kit_product._id' : 'product_id')}=${resourceId}`

    callApi(
      `orders.json?${itemsQuery}&status!=cancelled` +
        '&fields=created_at,number,status,items.product_id,items.kit_product,items.quantity,items.final_price,items.price' +
        '&sort=-number',
      'GET',

      (err, json) => {
        if (!err) {
          const { data, commit } = window.Tabs[tabId]
          const { result } = json
          let sales = result.length
          let qntSold = 0
          let totalSold = 0
          let totalClosed = 0
          if (sales === 1000 && data.sales > 1000) {
            sales = data.sales
            if (data.total_sold) {
              totalSold = data.total_sold
            }
          }

          if (sales) {
            const $lastOrders = $(`#t${tabId}-last-orders`)
            for (let i = 0; i < result.length; i++) {
              if (i >= 6 && sales > 1000) {
                break
              }
              const order = result[i]
              const isClosed = order.status === 'closed'
              if (i < 6) {
                $lastOrders.append($('<a>', {
                  class: 'dropdown-item',
                  html: [
                    $('<span>', {
                      class: `text-monospace ${(isClosed ? 'text-success' : 'text-info')}`,
                      text: order.number
                    }),
                    $('<span>', {
                      class: 'ml-2 small',
                      text: formatDate(order.created_at)
                    })
                  ],
                  href: `/#/resources/orders/${order._id}`
                }))
              }

              if (sales <= 1000) {
                order.items.forEach(item => {
                  if (isKit) {
                    if (!item.kit_product || item.kit_product._id !== resourceId) {
                      return
                    }
                  } else if (item.product_id !== resourceId) {
                    return
                  }
                  if (isKit && item.kit_product.pack_quantity) {
                    qntSold += (item.quantity / item.kit_product.pack_quantity)
                  } else {
                    qntSold += item.quantity
                  }
                  const subtotal = getPrice(item) * item.quantity
                  totalSold += subtotal
                  if (isClosed) {
                    totalClosed += subtotal
                  }
                })
              }
            }

            const totalClosedPc = Math.round(totalClosed * 100 / totalSold)
            $(`#t${tabId}-total-sold`).text(formatMoney(totalSold))
            $(`#t${tabId}-sales`).text(sales)
              .closest('a').attr('href', `/#/resources/orders?${itemsQuery}`)
            if (qntSold) {
              $(`#t${tabId}-qnt-sold`).text(`${qntSold}un`)
              $(`#t${tabId}-avg-price`).text(formatMoney(totalSold / qntSold))
            } else {
              $(`#t${tabId}-qnt-sold, #t${tabId}-avg-price`).closest('.col-auto').remove()
            }
            if (totalClosed) {
              $(`#t${tabId}-total-closed`).text(formatMoney(totalClosed))
              $(`#t${tabId}-total-closed-pc`).text(`~${totalClosedPc}%`)
            } else {
              $(`#t${tabId}-total-closed`).closest('.col-auto').remove()
            }
            $(`#t${tabId}-product-orders`).slideDown()
          }

          if (data.sales !== sales || data.total_sold !== totalSold) {
            Object.assign(data, {
              sales,
              total_sold: totalSold
            })
            commit(data, true)
          }
        }
      }
    )
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(listProductOrders)
  } else {
    setTimeout(listProductOrders, 2000)
  }
}
