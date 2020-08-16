import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/messaging'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyBbCf1Hs7ilZ3FVgjaOyImU8rZEqjqUuxM",
  authDomain: "ppdb-ptsp.firebaseapp.com",
  databaseURL: "https://ppdb-ptsp.firebaseio.com",
  projectId: "ppdb-ptsp",
  storageBucket: "ppdb-ptsp.appspot.com",
  messagingSenderId: "381942125398",
  appId: "1:381942125398:web:1c464fb0ea108d68933cf7",
  measurementId: "G-SCCPJBQV3N"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const RecaptchaVerifier = firebase.auth.RecaptchaVerifier
const increment = firebase.firestore.FieldValue.increment
const { Timestamp } = firebase.firestore
const messaging = firebase.messaging()

// Offline support
db.enablePersistence()

// export utils/refs
export {
  db,
  auth,
  storage,
  messaging,
  RecaptchaVerifier,
  Timestamp,
  increment
}