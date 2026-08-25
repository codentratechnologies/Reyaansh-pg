importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCCBckBIp276dTw-qV_heNmTITJK348krc",
  authDomain: "pg-management-70b1c.firebaseapp.com",
  projectId: "pg-management-70b1c",
  storageBucket: "pg-management-70b1c.firebasestorage.app",
  messagingSenderId: "661043253919",
  appId: "1:661043253919:web:f048e436f40322912188aa",
  measurementId: "G-SV4KNT5GJV"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[checkout-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Minimal SW just to satisfy browser PWA requirements
});
