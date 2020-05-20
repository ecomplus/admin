import gridsFormHTML from '@/dashboard/views/resources/form/grids.html'
import Resources from '../../controllers/resources'
import { handleList } from '../../controllers/resources/list'
import * as form from '../../controllers/resources/form'
import * as gridsForm from '../../controllers/resources/form/grids'

class GridsResource extends Resources {
  constructor(resourceEl) {
    super(resourceEl)
    this.formHTML = gridsFormHTML
    this.listLoaders = [handleList]
    this.formLoaders = [
      form.handleForm,
      gridsForm.handleForm
    ]
  }
}

export default GridsResource