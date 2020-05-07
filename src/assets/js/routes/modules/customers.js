import * as customerFormHTML from '~/views/resources/form/customers.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'
import * as customersForm from '../../controllers/resources/form/customers'

class CustomerResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.formHTML = customerFormHTML
    this.listLoaders = [ handleList ]
    this.formLoaders = [
      form.handleForm,
      customersForm.handleForm
    ]
  }
}

export default CustomerResource