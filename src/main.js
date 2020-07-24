import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { auth } from './firebase'

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    let phoneNumber = ''
    let email = ''
    if(user.phoneNumber) { phoneNumber = user.phoneNumber.substring(3) }
    if(user.email) { email = user.email }
    store.dispatch('authUser', { user: user, phoneNumber: phoneNumber, email: email })
    // store.dispatch('fetchUserProfile', user)
  }
})