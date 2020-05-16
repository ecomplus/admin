import { routes } from '../routes'

export const router = (route, internal, routeInProgress, currentTab, appTabs, routeReadyTimeout) => {
  if (!internal) {
    if (routeInProgress === true) {
      // routing in progress
      return
    }
    // console.log('Go to route => ' + route)
    if (currentTab !== null) {
      // add route to history
      appTabs[currentTab].routesHistory.push(route)
    }
  }
  routeInProgress = true

  // reset route parameters
  window.routeParams = []
  var paths = route.split('/')
  // final route HTML file URI
  // only the first path
  var uri = '../routes/modules/' + paths[0] + '.js'
  for (var i = 1; i < paths.length; i++) {
    // URI param
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
  route.load(el)
}

export const handleError = (error, el) => {
  import(`~/views/${error}.html`).then(html => {
    el.html(html.default)
  })
}

