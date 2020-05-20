import cartsFormHTML from '@/views/resources/form/carts.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'
import * as cartsForm from '../../controllers/resources/form/carts'

class CartsResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.formHTML = cartsFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [
      form.handleForm,
      cartsForm.handleForm
    ]
  }
}

export default CartsResource