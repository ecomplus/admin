import newPageHTML from '@/views/new.html'

const fixHtmlImport = importPromise => importPromise
  .then(exp => ({ html: exp.default }))

export default path => {
  switch (path) {
    case 'new':
      return Promise.resolve({ html: newPageHTML })
    case 'home':
      return import(/* webpackChunkName: "router_routes_home" */ '@/router/routes/home')
    case 'resources':
      return import(/* webpackChunkName: "router_routes_resources" */ '@/router/routes/resources')
    case 'apps':
      return import(/* webpackChunkName: "router_routes_apps" */ '@/router/routes/apps')
    case 'abandoned-cart':
      return import(/* webpackChunkName: "router_routes_abandoned-cart" */ '@/router/routes/abandoned-cart')
    case 'best-sellers':
      return import(/* webpackChunkName: "router_routes_best-sellers" */ '@/router/routes/best-sellers')
    case 'birth-report':
      return import(/* webpackChunkName: "router_routes_inventory" */ '@/router/routes/birth-report')
    case 'cashback':
      return import(/* webpackChunkName: "router_routes_inventory" */ '@/router/routes/cashback')
    case 'campaign-report':
      return import(/* webpackChunkName: "router_routes_campaign-report" */ '@/router/routes/campaign-report')
    case 'coupon-report':
      return import(/* webpackChunkName: "router_routes_coupon-report" */ '@/router/routes/coupon-report')
    case 'device-report':
      return import(/* webpackChunkName: "router_routes_device-report" */ '@/router/routes/device-report')
    case 'freight-report':
      return import(/* webpackChunkName: "router_routes_inventory" */ '@/router/routes/freight-report')
    case 'inventory':
      return import(/* webpackChunkName: "router_routes_inventory" */ '@/router/routes/inventory')
    case 'invoices':
      return import(/* webpackChunkName: "router_routes_invoices" */ '@/router/routes/invoices')
    case 'settings':
      return import(/* webpackChunkName: "router_routes_settings" */ '@/router/routes/settings')
    case 'shipping-tags':
      return import(/* webpackChunkName: "router_routes_shipping-tags" */ '@/router/routes/shipping-tags')
    case '500':
      return fixHtmlImport(import(/* webpackChunkName: "views_500.html" */ '@/views/500.html'))
    default:
      return fixHtmlImport(import(/* webpackChunkName: "views_404.html" */ '@/views/404.html'))
  }
}
