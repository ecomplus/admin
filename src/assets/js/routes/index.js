import * as home from './modules/home'
import * as settings from './modules/settings'
import * as apps from './modules/apps'
import CustomerResource from './modules/customers'
import CartsResource from './modules/carts'
import OrdersResource from './modules/orders'
import ProductsResource from './modules/products'
import BrandsResource from './modules/brands'
import CategoriesResource from './modules/categories'

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
    path: '/resources/orders',
    load: (el) => {
      const ordersResource = new OrdersResource(el)
      ordersResource.handleResource()
    }
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
  },
  {
    path: '/resources/products',
    load: (el) => {
      const productsResource = new ProductsResource(el)
      productsResource.handleResource()
    }
  },
  {
    path: '/resources/categories',
    load: (el) => {
      const categoriesResource = new CategoriesResource(el)
      categoriesResource.handleResource()
    }
  },
]