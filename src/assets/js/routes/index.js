import * as home from './modules/home'
import * as settings from './modules/settings'
import * as apps from './modules/apps'
import CustomerResource from './modules/customers'
import CartsResource from './modules/customers'

export const routes = [
  {
    path: '/home',
    load: (el) => home.load(el)
  },
  {
    path: '/settings',
    load: (el) => settings.load(el)
  },
  {
    path: '/apps',
    load: (el) => apps.load(el)
  },
  {
    path: '/resources/customers',
    load: (el) => {
      const customerResource = new CustomerResource(el)
      customerResource.handleResource()
    }
  },
  {
    path: '/resources/carts',
    load: (el) => {
      const cartsResource = new CartsResource(el)
      cartsResource.handleResource()
    }
  }
]