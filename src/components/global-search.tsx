"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { createSearchIndex, highlightSearchMatch, rankSearchItems } from "@/lib/search";
import type { GlobalSearchItem } from "@/lib/search";

const maxVisibleSearchResults = 10;

function isTextEntryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || target.matches("input, textarea, select");
}

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  return (
    <>
      {highlightSearchMatch(title, query).map((segment) => (
        segment.matched
          ? <mark key={segment.start}>{segment.value}</mark>
          : <span key={segment.start}>{segment.value}</span>
      ))}
    </>
  );
}

export function GlobalSearch({
  recordCount,
  items,
}: {
  recordCount: number;
  items: GlobalSearchItem[];
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const searchIndex = useMemo(() => createSearchIndex(items), [items]);
  const rankedResults = useMemo(() => rankSearchItems(searchIndex, query), [searchIndex, query]);
  const quickAccess = useMemo(() => items.filter((item) => item.kind === "page").slice(0, 6), [items]);
  const visibleResults = query.trim()
    ? rankedResults.slice(0, maxVisibleSearchResults)
    : quickAccess;
  const activeResult = visibleResults[activeIndex];
  const activeOptionId = activeResult ? `global-search-option-${activeResult.id}` : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    function handleGlobalShortcut(event: KeyboardEvent) {
      if (event.repeat) return;
      const commandShortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      const slashShortcut = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey
        && !isTextEntryTarget(event.target);

      if (!commandShortcut && !slashShortcut) return;
      const otherOpenDialog = document.querySelector<HTMLDialogElement>("dialog[open]");
      if (otherOpenDialog && otherOpenDialog !== dialogRef.current) return;
      event.preventDefault();
      setOpen((current) => !current);
      setActiveIndex(0);
    }

    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  useEffect(() => {
    if (!open || !activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
  }, [activeOptionId, open]);

  function closeSearch() {
    setOpen(false);
  }

  function resetClosedSearch() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function moveActiveResult(direction: 1 | -1) {
    if (visibleResults.length === 0) return;
    setActiveIndex((current) => (current + direction + visibleResults.length) % visibleResults.length);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveResult(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveResult(-1);
      return;
    }
    if (event.key === "Home" && visibleResults.length > 0) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End" && visibleResults.length > 0) {
      event.preventDefault();
      setActiveIndex(visibleResults.length - 1);
      return;
    }
    if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      closeSearch();
      router.push(activeResult.href);
    }
  }

  return (
    <>
      <button
        className="global-search-trigger"
        type="button"
        aria-label="Search HarnessMatch"
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K /"
        onClick={() => {
          setActiveIndex(0);
          setOpen(true);
        }}
      >
        <span>Search</span>
        <kbd>/</kbd>
      </button>

      <dialog
        className="dialog-surface global-search-dialog"
        ref={dialogRef}
        aria-labelledby="global-search-title"
        onCancel={() => setOpen(false)}
        onClose={resetClosedSearch}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeSearch();
        }}
      >
        <div className="global-search-panel">
          <div className="global-search-heading">
            <label id="global-search-title" htmlFor="global-search-input">Search products and pages</label>
            <button type="button" onClick={closeSearch}>Close</button>
          </div>

          <input
            className="global-search-input"
            id="global-search-input"
            ref={inputRef}
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="global-search-results"
            aria-expanded={visibleResults.length > 0}
            aria-activedescendant={activeOptionId}
            aria-describedby="global-search-help"
            autoComplete="off"
            placeholder="Try T3 Code, Claude, or benchmarks"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />

          <p className="global-search-help" id="global-search-help">
            {query.trim()
              ? `${rankedResults.length} match${rankedResults.length === 1 ? "" : "es"}`
              : `Search ${recordCount} product records by name, workflow, interface, or documented capability.`}
          </p>

          <div className="global-search-results-shell">
            <div className="global-search-results-label" id="global-search-results-label">
              {query.trim() ? "Results" : "Quick access"}
            </div>

            <div
              className="global-search-results"
              id="global-search-results"
              role="listbox"
              aria-labelledby="global-search-results-label"
            >
              {visibleResults.map((item, index) => (
                <Link
                  className="global-search-result"
                  id={`global-search-option-${item.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  href={item.href}
                  key={item.id}
                  tabIndex={-1}
                  onClick={closeSearch}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {item.imageSrc ? (
                    <span className="global-search-result-logo" aria-hidden="true">
                      <Image src={item.imageSrc} alt="" width={30} height={30} />
                    </span>
                  ) : (
                    <span className="global-search-page-glyph" aria-hidden="true">/</span>
                  )}
                  <span className="global-search-result-copy">
                    <strong><HighlightedTitle title={item.title} query={query} /></strong>
                    <small>{item.description}</small>
                  </span>
                  <span className="global-search-result-meta">{item.meta}</span>
                </Link>
              ))}

              {query.trim() && visibleResults.length === 0 && (
                <div className="global-search-empty">
                  <strong>No matching product or page.</strong>
                  <span>Try a product name, interface, or capability such as local models.</span>
                </div>
              )}
            </div>
          </div>

          <div className="global-search-footer">
            <span>Use ↑ ↓ to move, Enter to open, Esc to close.</span>
            {rankedResults.length > maxVisibleSearchResults && (
              <span>Showing {maxVisibleSearchResults} of {rankedResults.length}. Keep typing to narrow the list.</span>
            )}
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {query.trim() ? `${rankedResults.length} search results.` : "Quick access links shown."}
          </p>
        </div>
      </dialog>
    </>
  );
}
