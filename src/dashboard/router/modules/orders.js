import * as ordersFormHTML from '@/dashboard/views/resources/form/orders.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'
import * as ordersForm from '../../controllers/resources/form/orders'

class OrdersResource extends Resources {
  constructor (resourceEl) {
    super(resourceEl)
    this.formHTML = ordersFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [
      form.handleForm,
      ordersForm.handleForm
    ]
  }
}

export default OrdersResource
