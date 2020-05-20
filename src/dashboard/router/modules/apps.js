import * as html from '@/dashboard/views/apps.html'

export const load = el => {
  el.html(html)
  import('@ecomplus/admin-marketplace/src/main').catch(console.error)
}
