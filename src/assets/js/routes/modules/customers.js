import customerFormHTML from '~/views/resources/form/customers.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'

class CustomerResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
  }

  getFormHtml() {
    return customerFormHTML
  }

  handleResource() {
    super.handleResource()
    setTimeout(handleList, 500)
  }
}

export default CustomerResource