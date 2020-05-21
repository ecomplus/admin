import productsListHTML from '@/dashboard/views/resources/list/products.html'
import productsFormHTML from '@/dashboard/views/resources/form/products.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list/products'
import * as form from '../../controllers/resources/form'
import * as productsForm from '../../controllers/resources/form/products'

class ProductsResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.listHTML = productsListHTML
    this.formHTML = productsFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [
      form.handleForm,
      productsForm.handleForm
    ]
  }

  preLoadData() {
    if (!this.islisting()) {
      return super.preLoadData()
    }
    let body = {
      sort: [
        { available: { order: 'desc' } },
        '_score',
        { ad_relevance: { order: 'desc' } },
        { _id: { order: 'desc' } }
      ],
      aggs: {
        'brands.name': { terms: { field: 'brands.name' } },
        'categories.name': { terms: { field: 'categories.name' } },
        status: { terms: { field: 'status' } },
        // Metric Aggregations
        min_price: { min: { field: 'price' } },
        max_price: { max: { field: 'price' } },
        avg_price: { avg: { field: 'price' } }
      },
      // results limit
      size: 30
    }
    return { body }
  }

  loadData(callback, query, sort, page, size) {
    let self = this
    if (!self || !(self instanceof ProductsResource)) {
      self = window.Tabs[window.tabId].resourceInstance
    }
    if (!self.islisting()) {
      return super.loadData(() => {
        this.renderH1()
      })
    }
    let { body } = self.preLoadData()

    if (query) {
      // merge params without changing original default body
      // query object with search results conditions
      body = Object.assign({ query: query }, body)
    }

    if (sort) {
      // replace sort rule
      if (body.sort.length > 4) {
        body.sort[2] = sort
      } else {
        body.sort.splice(2, 0, sort)
      }
    }
    // pagination
    if (size) {
      body.size = size
    }
    if (page) {
      body.from = body.size * page
    } else {
      body.from = 0
    }
    window.callSearchApi('items.json', 'POST', (err, json) => {
      if (!err) {
        self.commit(json)
      }
      if (typeof(callback) === 'function') {
        callback()
      }
      self.loadContent()
    }, body)
  }
}

export default ProductsResource
