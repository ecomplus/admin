/* global workbox */

workbox.core.skipWaiting()
workbox.core.clientsClaim()

/* global self */

workbox.precaching.precacheAndRoute(self.__precacheManifest)

/**
 * Runtime caching
 */

/**
 * Images with unique URLs from E-Com Plus Storage
 * Check sizes: https://github.com/ecomclub/storage-api/blob/master/bin/web.js#L261
 */

// normal and thumbnail sizes
workbox.routing.registerRoute(
  /^https:\/\/ecom-[\w]+\.[\w]+\.digitaloceanspaces\.com\/imgs\/[12345]?[0-9]{2}px\//,
  new workbox.strategies.CacheFirst({
    cacheName: 'pictures',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        // 30 days max age
        maxAgeSeconds: 60 * 60 * 24 * 30,
        purgeOnQuotaError: true
      })
    ]
  })
)

// big images
workbox.routing.registerRoute(
  /^https:\/\/ecom-[\w]+\.[\w]+\.digitaloceanspaces\.com\/imgs\/[678]?[0-9]{2}px\//,
  new workbox.strategies.CacheFirst({
    cacheName: 'pictures-big',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        // 2 days only max age
        maxAgeSeconds: 60 * 60 * 24 * 2,
        purgeOnQuotaError: true
      })
    ]
  })
)

/**
 * Same origin assets
 */

// theme assets directory
workbox.routing.registerRoute(
  /\/assets\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets'
  })
)

// image files
workbox.routing.registerRoute(
  /\/img\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'img'
  })
)

/**
 * Routes
 */

// homepage
workbox.routing.registerRoute('/', new workbox.strategies.NetworkFirst())

// login
workbox.routing.registerRoute('/pages/login.html', new workbox.strategies.NetworkFirst())
