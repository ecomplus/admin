import categoriesFormHTML from '@/dashboard/views/resources/form/categories.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'

class CategoriesResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.formHTML = categoriesFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [form.handleForm]
  }
}

export default CategoriesResource