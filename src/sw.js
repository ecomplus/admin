import { skipWaiting, clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

skipWaiting()
clientsClaim()

/**
 * Runtime caching
 */

// Google Fonts stylesheets
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
)

// underlying font files
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        // large expiration time
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
)

// jQuery library
registerRoute(
  /^https:\/\/code\.jquery\.com/,
  new StaleWhileRevalidate({
    cacheName: 'cdn-jquery'
  })
)

// additional JS libraries from CDN
registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net/,
  new StaleWhileRevalidate({
    cacheName: 'cdn-jsdelivr'
  })
)

/**
 * Same origin assets
 */

// theme core
registerRoute(
  /\/assets\/(js|css)\//,
  new CacheFirst({
    cacheName: 'theme'
  })
)

// theme assets and vendors
registerRoute(
  /\/assets\/(?!js|css)[^/]+\//,
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        purgeOnQuotaError: true
      })
    ]
  })
)

// logo images
registerRoute(
  /\/img\//,
  new StaleWhileRevalidate({
    cacheName: 'logo'
  })
)

// bundle entries
registerRoute(
  /\/admin\./,
  new NetworkFirst({
    cacheName: 'entries'
  })
)

// bundle chunks
registerRoute(
  /\/chunks\//,
  new NetworkFirst({
    cacheName: 'chunks',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100
      })
    ]
  })
)

/**
 * Routes
 */

// dashboard
registerRoute('/', new NetworkFirst())

// login
registerRoute('/login', new NetworkFirst())

/**
 * E-Com Plus APIs
 * Prefer live content from network
 * Check available hosts: https://github.com/ecomclub/ecomplus-sdk-js/blob/master/main.js
 */

// Main API and Storefront API cache
registerRoute(
  /^https:\/\/io(storefront)?\.ecvol\.com/,
  new NetworkFirst({
    networkTimeoutSeconds: 3,
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20
      })
    ]
  })
)

// Store API cache
registerRoute(
  /^https:\/\/ioapi?\.ecvol\.com/,
  new NetworkFirst({
    networkTimeoutSeconds: 3,
    cacheName: 'store-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        // purge large JSON files to release quota
        purgeOnQuotaError: true
      })
    ]
  })
)

// Live Store and Search API
registerRoute(
  /^https:\/\/(?:api|apx-search).e-com\.plus\/(api\/)?v[1-9]+\//,
  new NetworkFirst({
    cacheName: 'live-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        // keep for 5 minutes only
        maxAgeSeconds: 5 * 60
      })
    ]
  })
)

/**
 * Images with unique URLs from E-Com Plus Storage
 * Check sizes: https://github.com/ecomclub/storage-api/blob/master/bin/web.js#L282
 */

// normal and thumbnail sizes
registerRoute(
  /^https:\/\/ecom-[\w]+\.[\w]+\.digitaloceanspaces\.com\/imgs\/([12345]?[0-9]{2}px|normal|small)\//,
  new CacheFirst({
    cacheName: 'pictures',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        // 30 days max age
        maxAgeSeconds: 60 * 60 * 24 * 30,
        purgeOnQuotaError: true
      })
    ]
  })
)

// big images
registerRoute(
  /^https:\/\/ecom-[\w]+\.[\w]+\.digitaloceanspaces\.com\/imgs\/([678]?[0-9]{2}px|big)\//,
  new CacheFirst({
    cacheName: 'pictures-big',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        // 2 days only max age
        maxAgeSeconds: 60 * 60 * 24 * 2,
        purgeOnQuotaError: true
      })
    ]
  })
)
