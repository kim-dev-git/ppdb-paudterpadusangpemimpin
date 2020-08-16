importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js");
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-analytics.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyBbCf1Hs7ilZ3FVgjaOyImU8rZEqjqUuxM",
  authDomain: "ppdb-ptsp.firebaseapp.com",
  databaseURL: "https://ppdb-ptsp.firebaseio.com",
  projectId: "ppdb-ptsp",
  storageBucket: "ppdb-ptsp.appspot.com",
  messagingSenderId: "381942125398",
  appId: "1:381942125398:web:1c464fb0ea108d68933cf7",
  measurementId: "G-SCCPJBQV3N"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  // console.log(
  //     "[firebase-messaging-sw.js] Received background message ",
  //     payload,
  // );

  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.icon,
  };

  return self.registration.showNotification(
      notificationTitle,
      notificationOptions,
  );
});