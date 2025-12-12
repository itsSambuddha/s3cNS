// public/firebase-messaging-sw.js
// Imports are handled by the browser's importScripts
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC2FVThtugQFaXunbbt1X6ht4wkKAD1Tr4",
  authDomain: "s3cns-f159a.firebaseapp.com",
  projectId: "s3cns-f159a",
  storageBucket: "s3cns-f159a.appspot.com",
  messagingSenderId: "438835392978",
  appId: "1:438835392978:web:cc1d801ebaeac8e180b",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
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