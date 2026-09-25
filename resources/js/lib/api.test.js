import { describe, expect, it } from "vitest";
import { errorMessage, mergeMessages } from "./api";

describe("message reconciliation", () => {
    it("deduplicates overlapping page and socket responses while preserving read updates", () => {
        expect(
            mergeMessages(
                [{ id: 2, read_at: null }, { id: 3 }],
                [{ id: 1 }, { id: 2, read_at: "2026-01-01" }],
            ),
        ).toEqual([{ id: 1 }, { id: 2, read_at: "2026-01-01" }, { id: 3 }]);
    });
});
describe("request errors", () => {
    it("shows an actionable offline message without exposing internal errors", () => {
        expect(errorMessage(new Error("internal transport details"))).toContain(
            "Check your connection",
        );
        expect(
            errorMessage({
                response: {
                    status: 500,
                    data: { message: "Database credentials here" },
                },
            }),
        ).not.toContain("credentials");
    });
    it("explains throttling and field validation", () => {
        expect(errorMessage({ response: { status: 429 } })).toContain(
            "wait a minute",
        );
        expect(
            errorMessage({
                response: {
                    status: 422,
                    data: { errors: { body: ["Too long."] } },
                },
            }),
        ).toBe("Too long.");
    });
});
