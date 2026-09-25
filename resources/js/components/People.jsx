import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Search, UserPlus } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { Avatar, Notice, Pagination } from "./Shared";

export default function People({ onConversation }) {
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [people, setPeople] = useState({ data: [], meta: { last_page: 1 } });
    const [contacts, setContacts] = useState({ data: [], last_page: 1 });
    const [contactsLoading, setContactsLoading] = useState(true);
    const [contactPage, setContactPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery(search);
            setPage(1);
        }, 250);
        return () => clearTimeout(timer);
    }, [search]);
    const loadContacts = useCallback(async () => {
        try {
            setContacts(
                (
                    await api.get("/api/friendships", {
                        params: { page: contactPage },
                    })
                ).data,
            );
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setContactsLoading(false);
        }
    }, [contactPage]);
    useEffect(() => {
        loadContacts();
        const timer = setInterval(() => {
            if (!document.hidden) loadContacts();
        }, 10000);
        return () => clearInterval(timer);
    }, [loadContacts]);
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        api.get("/api/users", {
            params: { search: query, page },
            signal: controller.signal,
        })
            .then(({ data }) => setPeople(data))
            .catch((error) => {
                if (error.code !== "ERR_CANCELED")
                    setError(errorMessage(error));
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [query, page]);

    async function action(key, callback, success) {
        if (busy !== null) return;
        setBusy(key);
        setError("");
        setNotice("");
        try {
            await callback();
            await loadContacts();
            setNotice(success);
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setBusy(null);
        }
    }

    async function open(person) {
        setError("");
        try {
            await onConversation(person);
        } catch (error) {
            setError(errorMessage(error));
        }
    }

    return (
        <section className="people-page">
            <header>
                <p className="eyebrow">Better together</p>
                <h1>Your people.</h1>
                <p className="muted">
                    Find a familiar face. Make a new connection.
                </p>
            </header>
            <Notice>{error}</Notice>
            {notice && (
                <p className="success-note" role="status">
                    {notice}
                </p>
            )}
            <section aria-labelledby="contacts-heading">
                <div className="section-title">
                    <h2 id="contacts-heading">Contacts & requests</h2>
                    <span className="muted">Keep in touch</span>
                </div>
                {contactsLoading ? (
                    <p className="empty-note" role="status">
                        Loading contacts…
                    </p>
                ) : contacts.data.length === 0 ? (
                    <p className="empty-note">
                        Your circle starts here. Find someone below and send a
                        contact request.
                    </p>
                ) : (
                    <div className="contact-list">
                        {contacts.data.map((contact) => (
                            <div className="contact-row" key={contact.id}>
                                <Avatar person={contact.person} />
                                <div className="contact-name">
                                    <strong>
                                        {contact.person.firstName}{" "}
                                        {contact.person.lastName}
                                    </strong>
                                    <span>
                                        {contact.status === "accepted"
                                            ? "Contact"
                                            : contact.status === "sent"
                                              ? "Request sent"
                                              : "Wants to connect"}
                                    </span>
                                </div>
                                <div className="contact-actions">
                                    {contact.status === "received" && (
                                        <button
                                            className="button small primary"
                                            disabled={busy !== null}
                                            onClick={() =>
                                                action(
                                                    contact.id,
                                                    () =>
                                                        api.put(
                                                            `/api/friendships/${contact.id}`,
                                                        ),
                                                    "Contact request accepted.",
                                                )
                                            }
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {contact.status === "accepted" && (
                                        <button
                                            className="icon-button"
                                            aria-label={`Message ${contact.person.firstName}`}
                                            onClick={() => open(contact.person)}
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                    )}
                                    <button
                                        className="text-button"
                                        disabled={busy !== null}
                                        onClick={() =>
                                            action(
                                                contact.id,
                                                () =>
                                                    api.delete(
                                                        `/api/friendships/${contact.id}`,
                                                    ),
                                                contact.status === "accepted"
                                                    ? "Contact removed."
                                                    : contact.status ===
                                                        "received"
                                                      ? "Request declined."
                                                      : "Request canceled.",
                                            )
                                        }
                                    >
                                        {contact.status === "accepted"
                                            ? "Remove"
                                            : contact.status === "received"
                                              ? "Decline"
                                              : "Cancel"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Pagination
                    page={contactPage}
                    lastPage={contacts.last_page}
                    onPage={setContactPage}
                />
            </section>
            <section aria-labelledby="discover-heading">
                <div className="section-title">
                    <h2 id="discover-heading">Find someone</h2>
                </div>
                <label className="search-field">
                    <Search size={18} aria-hidden="true" />
                    <span className="sr-only">
                        Search people by name or username
                    </span>
                    <input
                        placeholder="Search by name or username"
                        value={search}
                        maxLength={80}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>
                {loading ? (
                    <p className="empty-note" role="status">
                        Finding people…
                    </p>
                ) : people.data.length === 0 ? (
                    <p className="empty-note">
                        No matches. Try the start of a name or username.
                    </p>
                ) : (
                    <div className="people-grid">
                        {people.data.map((person) => (
                            <article className="person-card" key={person.id}>
                                <Avatar person={person} large />
                                <h3>
                                    {person.firstName} {person.lastName}
                                </h3>
                                <p>@{person.username}</p>
                                <div>
                                    <button
                                        className="button small"
                                        onClick={() => open(person)}
                                    >
                                        <MessageCircle
                                            size={16}
                                            aria-hidden="true"
                                        />{" "}
                                        Message
                                    </button>
                                    <button
                                        className="icon-button"
                                        disabled={
                                            busy !== null ||
                                            contacts.data.some(
                                                (contact) =>
                                                    contact.person.id ===
                                                    person.id,
                                            )
                                        }
                                        aria-label={`Connect with ${person.firstName}`}
                                        onClick={() =>
                                            action(
                                                person.id,
                                                () =>
                                                    api.post(
                                                        `/api/friendships/${person.id}`,
                                                    ),
                                                `Contact request sent to ${person.firstName}.`,
                                            )
                                        }
                                    >
                                        <UserPlus size={18} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                <Pagination
                    page={page}
                    lastPage={people.meta.last_page}
                    onPage={setPage}
                />
            </section>
        </section>
    );
}
