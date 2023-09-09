/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const authToken = localStorage.getItem('authToken');
if (authToken) {
    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST, // Use wssHost instead of wsHost
    wssHost: import.meta.env.VITE_PUSHER_HOST, // Use wssHost instead of wsHost
    wssPort: import.meta.env.VITE_PUSHER_PORT, // Use wssPort instead of wsPort
    wsPort: import.meta.env.VITE_PUSHER_PORT, // Use wssPort instead of wsPort
    forceTLS: false, // Set forceTLS to true for secure connection
    encrypted: false, // Set encrypted to true for secure connection
    disableStats: true,
    enabledTransports: ['ws', 'wss'], // Specify wss as the only transport
});
