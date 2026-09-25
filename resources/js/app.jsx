import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, LogOut, MessageCircle, Plus, Users } from "lucide-react";
import AuthScreen from "./components/AuthScreen";
import Conversation from "./components/Conversation";
import People from "./components/People";
import { Avatar, Notice, Pagination } from "./components/Shared";
import { api, errorMessage } from "./lib/api";
import { connectRealtime } from "./lib/realtime";
import "../css/app.css";

function App() {
    const [user, setUser] = useState(null);
    const [booting, setBooting] = useState(true);
    const [bootError, setBootError] = useState("");
    const [tab, setTab] = useState("messages");
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState({ data: [], last_page: 1 });
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [echo, setEcho] = useState(null);
    const [connected, setConnected] = useState(false);
    const [drafts, setDrafts] = useState({});

    const loadSession = useCallback(async () => {
        setBooting(true);
        setBootError("");
        try {
            setUser((await api.get("/api/me")).data.data);
        } catch (error) {
            if (error.response?.status !== 401)
                setBootError(errorMessage(error));
        } finally {
            setBooting(false);
        }
    }, []);
    useEffect(() => {
        // Clear credentials left by the previous bearer-token implementation.
        localStorage.removeItem("authToken");
        localStorage.removeItem("UID");
        loadSession();
        function expired() {
            setUser(null);
            setRoom(null);
            setRooms({ data: [], last_page: 1 });
        }
        window.addEventListener("session-expired", expired);
        return () => window.removeEventListener("session-expired", expired);
    }, [loadSession]);

    const loadRooms = useCallback(async () => {
        if (!user) return;
        try {
            setRooms(
                (await api.get("/api/conversations", { params: { page } }))
                    .data,
            );
            setError("");
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setRoomsLoading(false);
        }
    }, [user, page]);
    useEffect(() => {
        if (!user) return;
        setRoomsLoading(true);
        loadRooms();
        const timer = setInterval(() => {
            if (!document.hidden) loadRooms();
        }, 5000);
        return () => clearInterval(timer);
    }, [user, loadRooms]);
    useEffect(() => {
        if (!user) return;
        const connection = connectRealtime();
        setEcho(connection);
        const transport = connection?.connector.pusher.connection;
        const updateState = () =>
            setConnected(transport?.state === "connected");
        transport?.bind("state_change", updateState);
        updateState();
        return () => {
            transport?.unbind("state_change", updateState);
            connection?.disconnect();
            setEcho(null);
            setConnected(false);
        };
    }, [user]);

    async function start(person) {
        const { data } = await api.post("/api/conversations", {
            user_id: person.id,
        });
        setRoom(data);
        setTab("messages");
        setPage(1);
        loadRooms();
    }
    async function logout() {
        try {
            await api.post("/api/logout");
            setUser(null);
            setRoom(null);
            setDrafts({});
            setRooms({ data: [], last_page: 1 });
        } catch (error) {
            setError(errorMessage(error));
        }
    }
    if (booting)
        return (
            <main className="boot-screen" role="status">
                <MessageCircle /> Opening your space…
            </main>
        );
    if (bootError)
        return (
            <main className="boot-screen">
                <Notice retry={loadSession}>{bootError}</Notice>
            </main>
        );
    if (!user) return <AuthScreen onAuthenticated={setUser} />;

    return (
        <main
            className={`app-shell ${room && tab === "messages" ? "has-conversation" : ""} ${tab === "people" ? "show-people" : ""}`}
        >
            <nav className="app-rail" aria-label="Main navigation">
                <a href="/" className="rail-brand" aria-label="Chat Rooms home">
                    <MessageCircle />
                </a>
                <div className="rail-links">
                    <button
                        className={tab === "messages" ? "active" : ""}
                        onClick={() => {
                            setTab("messages");
                            setRoom(null);
                        }}
                        aria-label="Conversations"
                        aria-current={tab === "messages" ? "page" : undefined}
                    >
                        <MessageCircle />
                        <span>Chats</span>
                    </button>
                    <button
                        className={tab === "people" ? "active" : ""}
                        onClick={() => setTab("people")}
                        aria-label="People"
                        aria-current={tab === "people" ? "page" : undefined}
                    >
                        <Users />
                        <span>People</span>
                    </button>
                </div>
                <div className="rail-account">
                    <span title={`${user.firstName} ${user.lastName}`}>
                        <Avatar person={user} />
                    </span>
                    <button onClick={logout} aria-label="Sign out">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>
            <aside className="conversation-list">
                <header className="list-header">
                    <div>
                        <p className="eyebrow">Your little corner</p>
                        <h1>
                            Chat Rooms<span>.</span>
                        </h1>
                    </div>
                    <button
                        className="icon-button new-chat"
                        aria-label="Start a conversation"
                        onClick={() => setTab("people")}
                    >
                        <Plus />
                    </button>
                </header>
                <div className="inbox-caption">
                    <strong>Conversations</strong>
                    <span>{rooms.total || 0}</span>
                </div>
                <Notice retry={loadRooms}>{error}</Notice>
                <div className="room-list-scroll">
                    {roomsLoading && (
                        <p className="empty-note" role="status">
                            Loading conversations…
                        </p>
                    )}
                    {!roomsLoading && rooms.data.length === 0 && (
                        <div className="list-empty">
                            <MessageCircle />
                            <h2>A fresh start.</h2>
                            <p>Your conversations will appear here.</p>
                            <button
                                className="text-button"
                                onClick={() => setTab("people")}
                            >
                                Find someone to talk to{" "}
                                <ArrowUpRight size={15} />
                            </button>
                        </div>
                    )}
                    {rooms.data.map((item) => (
                        <button
                            className={`room-item ${room?.id === item.id ? "selected" : ""}`}
                            key={item.id}
                            onClick={() => {
                                setRoom(item);
                                setTab("messages");
                            }}
                            aria-pressed={room?.id === item.id}
                        >
                            <Avatar person={item.person} />
                            <span className="room-summary">
                                <strong>
                                    {item.person.firstName}{" "}
                                    {item.person.lastName}
                                </strong>
                                <span>
                                    {item.last_message?.body ||
                                        "Say your first hello."}
                                </span>
                            </span>
                            <span className="room-aside">
                                {item.last_message && (
                                    <time dateTime={item.last_message.sent_at}>
                                        {new Date(
                                            item.last_message.sent_at,
                                        ).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </time>
                                )}
                                {item.unread_count > 0 && (
                                    <b
                                        aria-label={`${item.unread_count} unread messages`}
                                    >
                                        {item.unread_count}
                                    </b>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
                <Pagination
                    page={page}
                    lastPage={rooms.last_page}
                    onPage={setPage}
                />
                <div className="list-footer">
                    <span className="online-dot" /> Signed in as{" "}
                    <strong>@{user.username}</strong>
                </div>
            </aside>
            {tab === "people" ? (
                <People onConversation={start} />
            ) : room ? (
                <Conversation
                    key={room.id}
                    room={room}
                    user={user}
                    echo={echo}
                    connected={connected}
                    onBack={() => setRoom(null)}
                    onUpdated={loadRooms}
                    draft={drafts[room.id] || { body: "", clientId: null }}
                    onDraft={(value) =>
                        setDrafts((previous) => ({
                            ...previous,
                            [room.id]: value,
                        }))
                    }
                />
            ) : (
                <section className="welcome-panel">
                    <div className="welcome-art" aria-hidden="true">
                        <div className="note-one">A small hello.</div>
                        <div className="note-two">
                            A good place to start. <span>✦</span>
                        </div>
                        <span className="art-star">✧</span>
                    </div>
                    <p className="eyebrow">Make space for connection</p>
                    <h2>
                        Less noise.
                        <br />
                        More conversation.
                    </h2>
                    <p>
                        Pick up a conversation, or find someone new.
                        <br />
                        There's always room for a little hello.
                    </p>
                    <button
                        className="button primary"
                        onClick={() => setTab("people")}
                    >
                        Find your people <ArrowUpRight size={18} />
                    </button>
                    <span className="welcome-foot">
                        Thoughtful conversations start with you.
                    </span>
                </section>
            )}
        </main>
    );
}

createRoot(document.getElementById("root")).render(<App />);
