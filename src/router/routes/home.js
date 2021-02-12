import setup from '@ecomplus/admin-home'

export const html = `
  <div class="main-content opacity-100">
    <div id="admin-home"></div>
  </div>`

export const onLoad = () => {
  window.routeReady('Home')
  setup()
}
