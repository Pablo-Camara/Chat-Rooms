import { useState } from "react";
import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { authenticate, errorMessage } from "../lib/api";
import { Notice } from "./Shared";

export default function AuthScreen({ onAuthenticated, initialError }) {
    const [mode, setMode] = useState("login");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(initialError || "");
    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        try {
            onAuthenticated(
                await authenticate(
                    mode,
                    Object.fromEntries(new FormData(event.currentTarget)),
                ),
            );
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setBusy(false);
        }
    }
    return (
        <main className="auth-layout">
            <section className="auth-story">
                <a href="/" className="wordmark">
                    <MessageCircle aria-hidden="true" /> Chat Rooms
                    <span className="wordmark-dot">.</span>
                </a>
                <div className="auth-copy">
                    <p className="eyebrow">A little closer, from anywhere.</p>
                    <h1>Good things start with a conversation.</h1>
                    <p>
                        A quiet place to catch up, share an idea, and keep the
                        conversation going.
                    </p>
                </div>
                <div
                    className="sample-conversation"
                    aria-label="Illustrative sample conversation"
                >
                    <p>
                        <span className="sample-name">
                            Alex · Sample conversation
                        </span>
                        One more idea before we call it a day?
                    </p>
                    <p>
                        Always. Let's hear it. <span aria-hidden="true">✦</span>
                    </p>
                </div>
                <p className="auth-foot">
                    <ShieldCheck size={17} aria-hidden="true" /> Private
                    conversations. No public feed.
                </p>
            </section>
            <section className="auth-form-area">
                <div className="auth-form-wrap">
                    <p className="eyebrow">Make yourself at home</p>
                    <h2>
                        {mode === "login"
                            ? "Welcome back."
                            : "Start something good."}
                    </h2>
                    <p className="muted">
                        {mode === "login"
                            ? "Sign in to pick up where you left off."
                            : "Create an account to find people and say hello."}
                    </p>
                    <Notice>{error}</Notice>
                    <form onSubmit={submit} className="auth-form">
                        {mode === "register" && (
                            <div className="name-fields">
                                <label>
                                    First name
                                    <input
                                        name="firstName"
                                        autoComplete="given-name"
                                        required
                                        maxLength={80}
                                    />
                                </label>
                                <label>
                                    Last name
                                    <input
                                        name="lastName"
                                        autoComplete="family-name"
                                        required
                                        maxLength={80}
                                    />
                                </label>
                            </div>
                        )}
                        <label>
                            Username
                            <input
                                name="username"
                                autoComplete="username"
                                required
                                minLength={mode === "register" ? 3 : 1}
                                maxLength={40}
                                autoCapitalize="none"
                                spellCheck="false"
                            />
                        </label>
                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                autoComplete={
                                    mode === "login"
                                        ? "current-password"
                                        : "new-password"
                                }
                                required
                                minLength={mode === "register" ? 12 : 1}
                                maxLength={255}
                                aria-describedby={
                                    mode === "register"
                                        ? "password-help"
                                        : undefined
                                }
                            />
                        </label>
                        {mode === "register" && (
                            <>
                                <p id="password-help" className="field-help">
                                    Use at least 12 characters. A memorable
                                    phrase works well.
                                </p>
                                <label>
                                    Confirm password
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        required
                                        minLength={12}
                                        maxLength={255}
                                    />
                                </label>
                            </>
                        )}
                        <button className="button primary" disabled={busy}>
                            {busy
                                ? "One moment…"
                                : mode === "login"
                                  ? "Sign in"
                                  : "Create account"}
                            <ArrowUpRight size={18} aria-hidden="true" />
                        </button>
                    </form>
                    <p className="auth-switch">
                        {mode === "login"
                            ? "New around here?"
                            : "Already have an account?"}{" "}
                        <button
                            onClick={() => {
                                setMode(
                                    mode === "login" ? "register" : "login",
                                );
                                setError("");
                            }}
                        >
                            {mode === "login" ? "Create an account" : "Sign in"}
                        </button>
                    </p>
                </div>
                <p className="auth-bottom">
                    A small space for better conversations.
                </p>
            </section>
        </main>
    );
}
