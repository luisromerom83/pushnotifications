/**
 * Firebase Cloud Messaging (FCM) Service Worker
 * Maneja la recepción de notificaciones Push cuando la aplicación web está cerrada o en segundo plano.
 */

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Parámetros de configuración pasados al registrar el Service Worker o valores por defecto
const urlParams = new URLSearchParams(self.location.search);
const configParam = urlParams.get('config');

let firebaseConfig = {
  apiKey: "AIzaSyADWBBgbALAnf1yFUzK2wKmYM4ptlqHpJ4",
  authDomain: "quadient-latam-app-demo.firebaseapp.com",
  projectId: "quadient-latam-app-demo",
  storageBucket: "quadient-latam-app-demo.firebasestorage.app",
  messagingSenderId: "342103810833",
  appId: "1:342103810833:web:10f01ce15c8682f5ba62b0"
};

if (configParam) {
  try {
    firebaseConfig = JSON.parse(decodeURIComponent(configParam));
  } catch (e) {
    console.warn('[SW] No se pudo parsear config param:', e);
  }
}

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.pushTitle || payload.data?.title || 'Nuevo mensaje en tu Inbox';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.pushBody || 'Tienes un nuevo contenido disponible.',
      icon: '/assets/icon-192.png',
      badge: '/assets/badge-72.png',
      data: {
        inboxId: payload.data?.inboxId,
        url: payload.data?.url || '/'
      },
      tag: payload.data?.inboxId || 'inbox-notification',
      renotify: true,
      requireInteraction: true
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (err) {
  console.log('[SW] Firebase Messaging en SW:', err.message);
}

// Al hacer clic en la notificación recibida
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Clic en notificación:', event.notification);
  event.notification.close();

  const targetUrl = event.notification.data?.inboxId 
    ? '/?inboxId=' + event.notification.data.inboxId 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si ya hay una pestaña abierta de la app, enfocarla y enviarle el mensaje
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (event.notification.data?.inboxId) {
            client.postMessage({
              type: 'OPEN_INBOX_ITEM',
              inboxId: event.notification.data.inboxId
            });
          }
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
