import cartsFormHTML from '~/views/resources/form/carts.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'

class CustomerResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
  }

  getFormHtml() {
    return cartsFormHTML
  }

  handleResource() {
    super.handleResource()
    setTimeout(handleList, 500)
  }
}

export default CustomerResource