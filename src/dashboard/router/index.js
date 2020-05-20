import routes from './routes'

const { $ } = window

export const router = (route, internal, routeInProgress, currentTab, appTabs, routeReadyTimeout) => {
  if (!internal) {
    if (routeInProgress === true) {
      return
    }
    if (currentTab !== null) {
      appTabs[currentTab].routesHistory.push(route)
    }
  }
  routeInProgress = true

  window.routeParams = []
  var paths = route.split('/')
  for (var i = 1; i < paths.length; i++) {
    if (paths[i] !== '') {
      window.routeParams.push(paths[i])
    }
  }

  $('#router > .loading').show()
  var elTab = $('#app-tab-' + currentTab)
  window.tabId = currentTab
  window.elTab = elTab
  window.Tabs[currentTab] = {
    state: window.Tabs[currentTab] ? window.Tabs[currentTab].state : {}
  }
  handleRoute('/' + paths.join('/'), elTab)
}

export const handleRoute = (uri, el) => {
  const route = routes.find(route => uri.startsWith(route.path))
  if (!route) {
    return handleError('404', el)
  }
  const promise = route.load(el)
  if (promise && promise.then) {
    promise.then(({ load }) => load(el)).catch(console.error)
  }
}

export const handleError = (error, el) => {
  import(`@/dashboard/views/${error}.html`).then(html => {
    el.html(html.default)
  })
}
