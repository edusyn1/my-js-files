importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAyQ53VJu0c8XLIExkw5b5HQX_OEkIGYqs",
  authDomain: "vzgaming.firebaseapp.com",
  projectId: "vzgaming",
  storageBucket: "vzgaming.firebasestorage.app",
  messagingSenderId: "220992774477",
  appId: "1:220992774477:web:5d1beba7021ef402521704",
  measurementId: "G-WD49B3FMFB"
});

const messaging = firebase.messaging();