// render-related-items.js
import { randomObjectId } from '@ecomplus/utils'
import renderKitItems from './render-kit-items'

export default function (tabId) {
  renderKitItems({
    tabId,
    tbodyId: 'related-items',
    inputId: 'new-related-item',
    btnId: 'add-related-item',
    docProp: 'related_products',
    onQuery (products) {
      if (products && products[0] && products[0].product_ids) {
        const joinProducts = products[0].product_ids.join('" "')
        return `_id:("${joinProducts}")`
      }
    },
    hasQuantity: false,
    onPropSet (data) {
      data.related_products = [{
        _id: randomObjectId(),
        product_ids: []
      }]
    },
    onItemAdd (relatedProducts, product) {
      relatedProducts[0].product_ids.push(
        product._id
      )
    }
  })
}
