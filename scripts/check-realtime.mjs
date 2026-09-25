import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import WebSocket from 'ws';

// Local integration check: requires the opt-in demo seed and running app/Reverb.
// Independent HTTP sessions and a raw socket prove delivery without UI polling.
const origin = `http://localhost:${process.env.APP_PORT || 8088}`;
const socketPort = process.env.REVERB_PUBLIC_PORT || 8089;
function session() {
    const cookies = new Map();
    return async (path, method = 'GET', body) => {
        const response = await fetch(`${origin}${path}`, {
            method,
            headers: {
                Accept: 'application/json', 'Content-Type': 'application/json', Origin: origin,
                Cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join('; '),
                'X-XSRF-TOKEN': decodeURIComponent(cookies.get('XSRF-TOKEN') || ''),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        for (const cookie of response.headers.getSetCookie()) {
            const pair = cookie.split(';')[0];
            const split = pair.indexOf('=');
            cookies.set(pair.slice(0, split), pair.slice(split + 1));
        }
        assert.ok(response.ok, `${method} ${path} returned ${response.status}`);
        return response.status === 204 ? null : response.json();
    };
}
const sender = session();
const receiver = session();
for (const [request, username] of [[sender, 'alex'], [receiver, 'jules']]) {
    await request('/sanctum/csrf-cookie');
    await request('/api/login', 'POST', { username, password: 'hello-there-demo' });
}
const person = (await receiver('/api/me')).data;
const room = await sender('/api/conversations', 'POST', { user_id: person.id });
const socket = new WebSocket(`ws://127.0.0.1:${socketPort}/app/chat-rooms-local?protocol=7&client=js&version=8.4.0`, { headers: { Origin: origin } });
const frames = [];
socket.on('message', (raw) => frames.push(JSON.parse(raw.toString())));
let socketError;
socket.on('error', (error) => { socketError = error; });
async function frame(event) {
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
        if (socketError) throw socketError;
        const index = frames.findIndex((item) => item.event === event);
        if (index >= 0) return frames.splice(index, 1)[0];
        await new Promise((resolve) => setTimeout(resolve, 25));
    }
    throw new Error(`Timed out waiting for ${event}`);
}
try {
    const connected = await frame('pusher:connection_established');
    const { socket_id } = JSON.parse(connected.data);
    const channel = `private-chatRoom.${room.id}`;
    const authorization = await receiver('/broadcasting/auth', 'POST', { socket_id, channel_name: channel });
    socket.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel, auth: authorization.auth } }));
    await frame('pusher_internal:subscription_succeeded');
    const sent = await sender(`/api/conversations/${room.id}/messages`, 'POST', { body: 'Let’s swap recommendations over coffee.', client_id: randomUUID() });
    const delivered = await frame('App\\Events\\ChatMessageSent');
    assert.equal(JSON.parse(delivered.data).message.id, sent.data.id);
    assert.equal(JSON.parse(delivered.data).message.body, sent.data.body);
    console.log('Authenticated private-channel message delivery verified without polling.');
} finally {
    socket.close();
    await sender('/api/logout', 'POST');
    await receiver('/api/logout', 'POST');
}
