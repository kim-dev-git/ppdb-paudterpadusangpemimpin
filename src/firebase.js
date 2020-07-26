import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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
const { Timestamp } = firebase.firestore

// Offline support
db.enablePersistence()

// export utils/refs
export {
  db,
  auth,
  storage,
  RecaptchaVerifier,
  Timestamp
}