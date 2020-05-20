import * as newPage from './modules/new'
import * as home from './modules/home'
import * as settings from './modules/settings'
import * as apps from './modules/apps'
import * as tag from './modules/tag'
import * as tagstandart from './modules/tagstandart'
import * as invoices from './modules/invoices'
import CustomerResource from './modules/customers'
import CartsResource from './modules/carts'
import OrdersResource from './modules/orders'
import ProductsResource from './modules/products'
import BrandsResource from './modules/brands'
import CategoriesResource from './modules/categories'
import CollectionsResource from './modules/collections'
import GridsResource from './modules/grids'


export const routes = [
  {
    path: '/new',
    load: (el) => newPage.load(el)
  },
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
    path: '/tagstandart',
    load: (el) => tagstandart.load(el)
  },
  {
    path: '/tag',
    load: (el) => tag.load(el)
  },
  {
    path: '/invoices',
    load: (el) => invoices.load(el)
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
    path: '/resources/brands',
    load: (el) => {
      const brandsResource = new BrandsResource(el)
      brandsResource.handleResource()
    }
  },
  {
    path: '/resources/categories',
    load: (el) => {
      const categoriesResource = new CategoriesResource(el)
      categoriesResource.handleResource()
    }
  },
  {
    path: '/resources/collections',
    load: (el) => {
      const collectionsResource = new CollectionsResource(el)
      collectionsResource.handleResource()
    }
  },
  {
    path: '/resources/grids',
    load: (el) => {
      const gridsResource = new GridsResource(el)
      gridsResource.handleResource()
    }
  },
]