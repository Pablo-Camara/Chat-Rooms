import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, CheckCheck, LockKeyhole, Send } from "lucide-react";
import { api, errorMessage, mergeMessages } from "../lib/api";
import { Avatar, Notice } from "./Shared";

export default function Conversation({
    room,
    user,
    echo,
    connected,
    onBack,
    onUpdated,
    draft,
    onDraft,
}) {
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [olderBusy, setOlderBusy] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [sendError, setSendError] = useState("");
    const scroll = useRef(null);
    const shouldScroll = useRef(true);
    const lastRead = useRef(0);
    const cancelled = useRef(false);

    const refresh = useCallback(async () => {
        if (document.hidden) return;
        try {
            const { data } = await api.get(
                `/api/conversations/${room.id}/messages`,
            );
            if (cancelled.current) return;
            setMessages((previous) => mergeMessages(previous, data.data));
            setHasMore((previous) =>
                lastRead.current ? previous : data.has_more,
            );
            const latest = data.data.at(-1)?.id || 0;
            if (shouldScroll.current && latest > lastRead.current) {
                await api.post(`/api/conversations/${room.id}/read`, {
                    through_id: latest,
                });
                lastRead.current = latest;
                onUpdated();
            }
            setError("");
        } catch (error) {
            if (!cancelled.current) setError(errorMessage(error));
        } finally {
            if (!cancelled.current) setLoading(false);
        }
    }, [room.id, onUpdated]);

    useEffect(() => {
        cancelled.current = false;
        refresh();
        const timer = window.setInterval(refresh, 5000);
        document.addEventListener("visibilitychange", refresh);
        const channel = echo?.private(`chatRoom.${room.id}`);
        channel
            ?.listen("ChatMessageSent", refresh)
            .listen("ChatMessageViewed", refresh);
        return () => {
            cancelled.current = true;
            window.clearInterval(timer);
            document.removeEventListener("visibilitychange", refresh);
            echo?.leave(`chatRoom.${room.id}`);
        };
    }, [room.id, echo, refresh]);

    useEffect(() => {
        if (shouldScroll.current && scroll.current)
            scroll.current.scrollTop = scroll.current.scrollHeight;
    }, [messages]);

    async function older() {
        setOlderBusy(true);
        const previousHeight = scroll.current.scrollHeight;
        try {
            const { data } = await api.get(
                `/api/conversations/${room.id}/messages`,
                { params: { before: messages[0].id } },
            );
            shouldScroll.current = false;
            setMessages((previous) => mergeMessages(previous, data.data));
            setHasMore(data.has_more);
            requestAnimationFrame(() => {
                if (scroll.current)
                    scroll.current.scrollTop +=
                        scroll.current.scrollHeight - previousHeight;
            });
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setOlderBusy(false);
        }
    }

    async function send(event) {
        event.preventDefault();
        if (sending || !draft.body.trim()) return;
        setSending(true);
        setSendError("");
        const pending = draft.clientId
            ? draft
            : { ...draft, clientId: crypto.randomUUID() };
        onDraft(pending);
        try {
            const { data } = await api.post(
                `/api/conversations/${room.id}/messages`,
                { body: pending.body.trim(), client_id: pending.clientId },
            );
            shouldScroll.current = true;
            setMessages((previous) => mergeMessages(previous, [data.data]));
            onDraft({ body: "", clientId: null });
            onUpdated();
        } catch (error) {
            setSendError(errorMessage(error));
        } finally {
            setSending(false);
        }
    }

    return (
        <section
            className="conversation"
            aria-label={`Conversation with ${room.person.firstName}`}
        >
            <header className="conversation-header">
                <button
                    className="icon-button mobile-back"
                    onClick={onBack}
                    aria-label="Back to conversations"
                >
                    <ArrowLeft />
                </button>
                <Avatar person={room.person} />
                <div>
                    <h2>
                        {room.person.firstName} {room.person.lastName}
                    </h2>
                    <p>@{room.person.username}</p>
                </div>
                <span className="private-label">
                    <LockKeyhole size={14} aria-hidden="true" /> Private
                    conversation
                </span>
            </header>
            <div
                className="message-scroll"
                ref={scroll}
                onScroll={() => {
                    const pane = scroll.current;
                    shouldScroll.current =
                        pane.scrollHeight - pane.scrollTop - pane.clientHeight <
                        100;
                }}
            >
                {hasMore && (
                    <button
                        className="older-button"
                        disabled={olderBusy}
                        onClick={older}
                    >
                        {olderBusy ? "Loading…" : "Load earlier messages"}
                    </button>
                )}
                <div className="conversation-intro">
                    <Avatar person={room.person} large />
                    <h3>A space for the two of you.</h3>
                    <p>
                        Only you and {room.person.firstName} can access this
                        conversation.
                    </p>
                </div>
                {loading && (
                    <p className="muted" role="status">
                        Loading conversation…
                    </p>
                )}
                <ol className="messages" aria-label="Messages">
                    {messages.map((message, index) => {
                        const own = message.sender_id === user.id;
                        const date = new Date(message.sent_at);
                        const previousDate = index
                            ? new Date(
                                  messages[index - 1].sent_at,
                              ).toDateString()
                            : "";
                        return (
                            <li key={message.id}>
                                {date.toDateString() !== previousDate && (
                                    <p className="date-divider">
                                        {date.toLocaleDateString(undefined, {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                )}
                                <div className={`message ${own ? "own" : ""}`}>
                                    <div className="bubble">{message.body}</div>
                                    <p className="message-meta">
                                        <time dateTime={message.sent_at}>
                                            {date.toLocaleTimeString(
                                                undefined,
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </time>
                                        {own && (
                                            <span
                                                aria-label={
                                                    message.read_at
                                                        ? "Read"
                                                        : "Sent"
                                                }
                                            >
                                                {message.read_at ? (
                                                    <CheckCheck size={14} />
                                                ) : (
                                                    <Check size={14} />
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
                <span className="sr-only" role="status">
                    {messages.length
                        ? `${messages.length} messages loaded.`
                        : "No messages yet."}
                </span>
            </div>
            <div className="composer-area">
                <Notice retry={refresh}>{error}</Notice>
                <Notice>{sendError}</Notice>
                <form className="composer" onSubmit={send}>
                    <label className="sr-only" htmlFor="message">
                        Message {room.person.firstName}
                    </label>
                    <textarea
                        id="message"
                        rows={2}
                        maxLength={255}
                        value={draft.body}
                        disabled={sending}
                        placeholder={`Write to ${room.person.firstName}…`}
                        onChange={(event) =>
                            onDraft({
                                body: event.target.value,
                                clientId: null,
                            })
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                !event.shiftKey &&
                                !event.nativeEvent.isComposing
                            ) {
                                event.preventDefault();
                                send(event);
                            }
                        }}
                    />
                    <button
                        className="send-button"
                        aria-label="Send message"
                        disabled={sending || !draft.body.trim()}
                    >
                        <Send size={19} aria-hidden="true" />
                    </button>
                </form>
                <div className="composer-help">
                    <span>
                        <i
                            className={connected ? "online-dot" : "offline-dot"}
                            aria-hidden="true"
                        />
                        {connected
                            ? "Live updates connected"
                            : "Checking for updates every 5 seconds"}
                    </span>
                    <span>
                        {draft.body.length}/255 · Shift + Enter for a new line
                    </span>
                </div>
            </div>
        </section>
    );
}
