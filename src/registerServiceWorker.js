/* eslint-disable no-console */

import { register } from 'register-service-worker'
import store from './store'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      store.dispatch('postServiceWorkerNotification', 'Pembaruan tersedia, sedang mengunduh.')
      console.log('New content is downloading.')
    },
    updated () {
      store.dispatch('postServiceWorkerNotification', 'Pembaruan selesai, silahkan muat ulang laman.')
      console.log('New content is available; please refresh.')
    },
    offline () {
      store.dispatch('postServiceWorkerNotification', 'Tidak ada koneksi internet. Anda menggunakan aplikasi dalam mode offline.')
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
