import * as html from '@/dashboard/views/apps.html'
import Vue from 'vue'
import App from '@ecomplus/admin-marketplace/src/App.vue'
import router from '@ecomplus/admin-marketplace/src/router'
import Antd from 'ant-design-vue'

export const load = el => {
  el.html(html)

  Vue.use(Antd)
  Vue.config.productionTip = false

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#admin-marketplace')
}
