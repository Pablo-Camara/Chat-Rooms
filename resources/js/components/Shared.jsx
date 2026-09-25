import { ChevronLeft, ChevronRight } from "lucide-react";

export function Avatar({ person, large = false }) {
    return (
        <span
            className={`avatar tone-${person.id % 4} ${large ? "large" : ""}`}
            aria-hidden="true"
        >
            {person.firstName?.[0]}
            {person.lastName?.[0]}
        </span>
    );
}

export function Notice({ children, retry }) {
    if (!children) return null;
    return (
        <div className="notice" role="alert">
            {children}
            {retry && <button onClick={retry}>Try again</button>}
        </div>
    );
}

export function Pagination({ page, lastPage, onPage }) {
    if (lastPage < 2) return null;
    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                disabled={page === 1}
                onClick={() => onPage(page - 1)}
                aria-label="Previous page"
            >
                <ChevronLeft size={17} />
            </button>
            <span>
                Page {page} of {lastPage}
            </span>
            <button
                disabled={page === lastPage}
                onClick={() => onPage(page + 1)}
                aria-label="Next page"
            >
                <ChevronRight size={17} />
            </button>
        </nav>
    );
}
