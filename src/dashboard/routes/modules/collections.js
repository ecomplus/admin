import collectionsFormHTML from '@/views/resources/form/collections.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'
import * as collectionsForm from '../../controllers/resources/form/collections'

class CollectionsResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.formHTML = collectionsFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [
      form.handleForm,
      collectionsForm.handleForm
    ]
  }
}

export default CollectionsResource