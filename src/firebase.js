import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyCUFVADXF_XNF0wMDt_En0X6M3PmGfp7NI",
  authDomain: "apel-bulog.firebaseapp.com",
  databaseURL: "https://apel-bulog.firebaseio.com",
  projectId: "apel-bulog",
  storageBucket: "apel-bulog.appspot.com",
  messagingSenderId: "140112429988",
  appId: "1:140112429988:web:fd71eba5c64fd7a571b731"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// export utils/refs
export {
  db,
  auth,
}