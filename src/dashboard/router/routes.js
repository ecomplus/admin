import * as newPage from './modules/new'

const handleResourceRoute = (importPromise, el) => {
  importPromise
    .then(exp => {
      const instance = new exp.default(el)
      instance.handleResource()
    })
    .catch(console.error)
}

const routes = [
  {
    path: '/new',
    ...newPage
  },
  {
    path: '/home',
    load: () => import('./modules/home')
  },
  {
    path: '/settings',
    load: () => import('./modules/settings')
  },
  {
    path: '/apps',
    load: () => import('./modules/apps')
  },
  {
    path: '/tagstandart',
    load: () => import('./modules/tagstandart')
  },
  {
    path: '/tag',
    load: () => import('./modules/tag')
  },
  {
    path: '/invoices',
    load: () => import('./modules/invoices')
  },
  {
    path: '/resources/orders',
    load: (el) => {
      handleResourceRoute(import('./modules/orders'), el)
    }
  },
  {
    path: '/resources/customers',
    load: (el) => {
      handleResourceRoute(import('./modules/customers'), el)
    }
  },
  {
    path: '/resources/carts',
    load: (el) => {
      handleResourceRoute(import('./modules/carts'), el)
    }
  },
  {
    path: '/resources/products',
    load: (el) => {
      handleResourceRoute(import('./modules/products'), el)
    }
  },
  {
    path: '/resources/brands',
    load: (el) => {
      handleResourceRoute(import('./modules/brands'), el)
    }
  },
  {
    path: '/resources/categories',
    load: (el) => {
      handleResourceRoute(import('./modules/categories'), el)
    }
  },
  {
    path: '/resources/collections',
    load: (el) => {
      handleResourceRoute(import('./modules/collections'), el)
    }
  },
  {
    path: '/resources/grids',
    load: (el) => {
      handleResourceRoute(import('./modules/grids'), el)
    }
  }
]

export default routes
