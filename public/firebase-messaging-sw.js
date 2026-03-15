// public/firebase-messaging-sw.js

// Import Firebase App directly and load it over CDN
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCfRvaP2GbkYmiIvN_NwblWgZOoT-IaZOo",
  authDomain: "s3cns-dd426.firebaseapp.com",
  projectId: "s3cns-dd426",
  storageBucket: "s3cns-dd426.firebasestorage.app",
  messagingSenderId: "612070263412",
  appId: "1:612070263412:web:a3cb19af4bc0c9f05f1f21",
};

// Initialize Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo/s3cnsLogo.svg",
    badge: "/logo/s3cnsLogo.svg",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.", event);
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    })
      .then((clientList) => {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});