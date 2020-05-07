// import * as html from '~/views/resources.html'
// import { loadResource } from '../resources'
import customerFormHTML from '~/views/resources/form/customers.html'
import Resources from '../resources'
import { handleList } from '../resources/list'

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