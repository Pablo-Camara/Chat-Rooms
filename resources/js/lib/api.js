import axios from "axios";

export const api = axios.create({
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
    timeout: 15000,
});

api.interceptors.response.use(undefined, (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/api/me") {
        window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
});

export function errorMessage(error) {
    if (error.response?.status === 429)
        return "A little too fast. Please wait a minute and try again.";
    if (error.response?.status === 419)
        return "Your session expired. Reload the page and try again.";
    if (error.response?.status >= 500)
        return "The service is unavailable. Your draft is still here; please try again.";
    const errors = error.response?.data?.errors;
    return errors
        ? Object.values(errors).flat()[0]
        : error.response?.data?.message ||
              "Could not connect. Check your connection and try again.";
}

// Never persist browser credentials in localStorage. Authentication stays in the
// HttpOnly session cookie; the readable XSRF cookie is only a request-forgery token.
export async function authenticate(mode, values) {
    await api.get("/sanctum/csrf-cookie");
    const response = await api.post(`/api/${mode}`, values);
    return response.data.data;
}

export function mergeMessages(previous, incoming) {
    const messages = new Map(previous.map((message) => [message.id, message]));
    incoming.forEach((message) => messages.set(message.id, message));
    return [...messages.values()].sort((left, right) => left.id - right.id);
}
