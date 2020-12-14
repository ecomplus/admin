import { i19apps } from '@ecomplus/i18n'
import { i18n } from '@ecomplus/utils'
import Vue from 'vue'
import App from '@ecomplus/admin-marketplace/src/App.vue'
import router from '@ecomplus/admin-marketplace/src/router'
import { ToastPlugin, VBTogglePlugin, ModalPlugin } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export const html = `
  <div class="main-content">
    <div id="admin-marketplace"></div>
  </div>`

export const onLoad = () => {
  window.routeReady(i18n(i19apps))
  Vue.use(ToastPlugin)
  Vue.use(VBTogglePlugin)
  Vue.use(ModalPlugin)
  Vue.config.productionTip = false

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#admin-marketplace')
}
