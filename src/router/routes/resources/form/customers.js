import handleImport from '@/lib/handle-import'
import customersFormHTML from '@/views/resources/form/customers.html'

export const html = customersFormHTML

export const onLoad = () => {
  handleImport(import(/* webpackChunkName: "controllers_resources_form" */
    '@/controllers/resources/form'), true)
  handleImport(import(/* webpackChunkName: "controllers_resources_form_customers" */
    '@/controllers/resources/form/customers'), true)
}
