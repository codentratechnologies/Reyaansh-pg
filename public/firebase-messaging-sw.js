self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Firebase hides the custom data in different places depending on the payload
    let targetUrl = "https://gossip-huntress-clambake.ngrok-free.dev/checkout"; // Default fallback
    
    if (event.notification.data) {
        if (event.notification.data.url) {
            targetUrl = event.notification.data.url;
        } else if (event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.data && event.notification.data.FCM_MSG.data.url) {
            targetUrl = event.notification.data.FCM_MSG.data.url;
        }
    }

    // Force the browser to open the tab
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // If the window is already open, just focus it
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});