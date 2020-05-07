import * as home from './modules/home'
import * as resources from './modules/resources'
import * as settings from './modules/settings'
import * as apps from './modules/apps'
import * as customers from './modules/customers'

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
    load: (el) => customers.load(el)
  },
  {
    path: '/resources',
    children: [
      {
        path: '/customers',
        load: (el) => customers.load(el)
      }
    ]
  },
]