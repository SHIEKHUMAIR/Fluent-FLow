// Service Worker for Push Notifications
// This file must be in the public directory

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating...');
  event.waitUntil(self.clients.claim());
});

// Handle incoming push notifications
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push received', event);
  
  let notificationData = {
    title: 'Fluent Flow',
    body: 'You have a new notification!',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: 'default',
    requireInteraction: false
  };

  // Try to parse push data
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[Service Worker] Parsed push data:', data);
      notificationData = {
        title: data.title || 'Fluent Flow',
        body: data.body || 'You have a new notification!',
        icon: data.icon || '/favicon.png',
        badge: '/favicon.png',
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false,
        data: data.data || {}
      };
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
      // Try to get text if JSON parsing fails
      try {
        const text = event.data.text();
        console.log('[Service Worker] Push data as text:', text);
        notificationData.body = text || notificationData.body;
      } catch (textError) {
        console.error('[Service Worker] Error reading push data as text:', textError);
      }
    }
  } else {
    console.log('[Service Worker] No push data in event');
  }

  console.log('[Service Worker] Showing notification:', notificationData);

  // Prepare notification options (make icon optional to avoid 404 errors)
  const notificationOptions = {
    body: notificationData.body,
    tag: notificationData.tag,
    requireInteraction: true, // Force notification to stay until user interacts
    data: notificationData.data,
    vibrate: [200, 100, 200],
    actions: [],
    silent: false, // Make sure sound plays
    timestamp: Date.now()
  };

  // Only add icon/badge if they exist (to avoid 404 errors)
  if (notificationData.icon) {
    notificationOptions.icon = notificationData.icon;
  }
  if (notificationData.badge) {
    notificationOptions.badge = notificationData.badge;
  }

  // Show notification
  // Note: showNotification() returns undefined when browser suppresses it (e.g., tab in focus)
  const notificationPromise = self.registration.showNotification(notificationData.title, notificationOptions)
    .then((notification) => {
      if (notification) {
        console.log('[Service Worker] ✅ Notification shown successfully');
        console.log('[Service Worker] Notification object:', notification);
        console.log('[Service Worker] Notification title:', notification.title);
        console.log('[Service Worker] Notification body:', notification.body);
      } else {
        console.warn('[Service Worker] ⚠️ Notification was suppressed by browser');
        console.warn('[Service Worker] This happens when the browser tab is in focus.');
        console.warn('[Service Worker] To see notifications: minimize browser, switch tabs, or check Windows notification center');
        
        // Try to notify all clients about the suppressed notification
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'NOTIFICATION_SUPPRESSED',
              data: notificationData
            });
          });
        });
      }
    })
    .catch(error => {
      console.error('[Service Worker] ❌ Error showing notification:', error);
      console.error('[Service Worker] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    });

  event.waitUntil(notificationPromise);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If app is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notification closed');
});
