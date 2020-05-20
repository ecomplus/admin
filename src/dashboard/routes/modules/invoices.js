import * as html from '@/views/invoices.html'
import * as form from '../../controllers/resources/form'
import * as invoices from '../../controllers/invoices'

export const load = async (el) => {
  el.html(html)
  form.handleForm()
  invoices.handleInvoices()
}