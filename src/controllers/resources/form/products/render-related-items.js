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
    getProducts (relatedProducts) {
      if (relatedProducts && relatedProducts[0]) {
        return relatedProducts[0].product_ids
      }
      return []
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
