import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { api } from "./api";

export function connectRealtime() {
    const key = import.meta.env.VITE_REVERB_APP_KEY;
    if (!key) return null;
    return new Echo({
        broadcaster: "reverb",
        key,
        client: new Pusher(key, {
            wsHost:
                import.meta.env.VITE_REVERB_HOST || window.location.hostname,
            wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8089),
            wssPort: Number(import.meta.env.VITE_REVERB_PORT || 443),
            forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
            enabledTransports: ["ws", "wss"],
            cluster: "mt1",
            authorizer: (channel) => ({
                authorize: (socketId, callback) => {
                    api.post("/broadcasting/auth", {
                        socket_id: socketId,
                        channel_name: channel.name,
                    })
                        .then(({ data }) => callback(null, data))
                        .catch((error) => callback(error, null));
                },
            }),
        }),
    });
}
