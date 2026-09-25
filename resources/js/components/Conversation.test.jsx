import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Conversation from "./Conversation";
import { api } from "../lib/api";

vi.mock("../lib/api", async (original) => ({
    ...(await original()),
    api: { get: vi.fn(), post: vi.fn() },
}));
const room = {
    id: 1,
    person: { id: 2, firstName: "Sofia", lastName: "Costa", username: "sofia" },
};
const updated = vi.fn();
function Harness() {
    const [draft, onDraft] = useState({ body: "", clientId: null });
    return (
        <Conversation
            room={room}
            user={{ id: 1 }}
            echo={null}
            connected={false}
            onBack={() => {}}
            onUpdated={updated}
            draft={draft}
            onDraft={onDraft}
        />
    );
}
afterEach(cleanup);
beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: { data: [], has_more: false } });
    api.post.mockResolvedValue({});
});

describe("sending a message", () => {
    it("keeps a failed draft and reuses its idempotency key when retried", async () => {
        const user = userEvent.setup();
        api.post
            .mockRejectedValueOnce(new Error("offline"))
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 4,
                        sender_id: 1,
                        body: "See you Saturday.",
                        sent_at: "2026-09-25T09:00:00Z",
                        read_at: null,
                    },
                },
            });
        render(<Harness />);
        await user.type(
            screen.getByRole("textbox", { name: "Message Sofia" }),
            "See you Saturday.",
        );
        await user.click(screen.getByRole("button", { name: "Send message" }));
        await screen.findByRole("alert");
        expect(screen.getByRole("textbox").value).toBe("See you Saturday.");
        const firstKey = api.post.mock.calls[0][1].client_id;
        await user.click(screen.getByRole("button", { name: "Send message" }));
        await waitFor(() => expect(screen.getByRole("textbox").value).toBe(""));
        expect(api.post.mock.calls[1][1].client_id).toBe(firstKey);
        expect(screen.getByText("See you Saturday.")).toBeTruthy();
    });

    it("renders message markup as text rather than executable HTML", async () => {
        const body = '<img src=x onerror="alert(1)">';
        api.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        sender_id: 2,
                        body,
                        sent_at: "2026-09-25T09:00:00Z",
                        read_at: null,
                    },
                ],
                has_more: false,
            },
        });
        const { container } = render(<Harness />);
        await screen.findByText(body);
        expect(container.querySelector("img")).toBeNull();
    });
});
