import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import './plugins/sw'
import './plugins/icons'
import EcDashboard from './components/templates/EcDashboard/App.vue'

Vue.config.productionTip = false

Vue.component('EcDashboard', EcDashboard)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
