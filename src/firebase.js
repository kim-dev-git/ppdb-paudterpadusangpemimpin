import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyCSfd3znlSq5BrEfwoWJTzmWeiqK7DltvY",
  authDomain: "ppdb-paudterpadusangpemimpin.firebaseapp.com",
  databaseURL: "https://ppdb-paudterpadusangpemimpin.firebaseio.com",
  projectId: "ppdb-paudterpadusangpemimpin",
  storageBucket: "ppdb-paudterpadusangpemimpin.appspot.com",
  messagingSenderId: "1098848928143",
  appId: "1:1098848928143:web:7ec9e5b72e1d92d30bcbfa"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const RecaptchaVerifier = firebase.auth.RecaptchaVerifier
const { Timestamp } = firebase.firestore

// export utils/refs
export {
  db,
  auth,
  RecaptchaVerifier,
  Timestamp
}