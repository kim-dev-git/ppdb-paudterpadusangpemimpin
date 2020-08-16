import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { auth, messaging } from './firebase'

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

    messaging.onMessage(payload => {
      // console.log('onMessage:', payload)
      var notification = payload.data
      notification.timeout = 5
      console.log(notification)
      store.dispatch('notifications/post', notification)
    })
  
    messaging.requestPermission()
      .then(function () {
        console.log("Notification permission granted.")
        // get the token in the form of promise
        return messaging.getToken()
      })
      .then(function(token) {
        console.log("Token:", token)
      })
      .catch(function (err) {
        console.log("Unable to get permission to notify.", err)
      })
  }
})