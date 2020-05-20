import brandsFormHTML from '@/views/resources/form/brands.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'

class BrandsResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.formHTML = brandsFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [
      form.handleForm
    ]
  }
}

export default BrandsResource