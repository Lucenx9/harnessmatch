"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { GuiPreview } from "@/lib/gui-types";

const provenanceLabels: Record<GuiPreview["provenance"], string> = {
  "official-media": "Official product media",
  "editorial-capture": "HarnessMatch capture",
};

export function GuiProductPreview({ id, name, preview }: { id: string; name: string; preview: GuiPreview }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogVideoRef = useRef<HTMLVideoElement>(null);

  function openPreview() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    videoRef.current?.pause();
    dialog.showModal();
  }

  function closePreview() {
    dialogVideoRef.current?.pause();
    dialogRef.current?.close();
  }

  useEffect(() => {
    if (preview.kind !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry || reducedMotion.matches || !entry.isIntersecting) {
        video.pause();
        return;
      }
      void video.play().catch(() => undefined);
    }, { threshold: 0.55 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [preview.kind]);

  return (
    <>
      <figure className="gui-product-preview" aria-labelledby={`gui-preview-${id}`}>
        <div className="gui-product-preview-media" style={{ aspectRatio: `${preview.width} / ${preview.height}` }}>
          {preview.kind === "image" ? (
            <Image
              src={preview.src}
              alt={preview.alt}
              fill
              sizes="(max-width: 720px) calc(100vw - 28px), min(1180px, calc(100vw - 48px))"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <video
              ref={videoRef}
              aria-label={preview.alt}
              controls
              loop
              muted
              playsInline
              poster={preview.poster}
              preload="metadata"
            >
              <source src={preview.src} type="video/mp4" />
            </video>
          )}
        </div>
        <figcaption id={`gui-preview-${id}`}>
          <span>{preview.caption}</span>
          <div className="gui-product-preview-meta">
            <button type="button" aria-haspopup="dialog" onClick={openPreview}>Open full size</button>
            <a href={preview.sourceUrl} target="_blank" rel="noreferrer">{provenanceLabels[preview.provenance]}</a>
            <time dateTime={preview.verifiedAt}>Checked {preview.verifiedAt}</time>
          </div>
        </figcaption>
      </figure>

      <dialog
        className="gui-preview-dialog"
        ref={dialogRef}
        aria-labelledby={`gui-preview-dialog-title-${id}`}
        onClose={() => dialogVideoRef.current?.pause()}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
      >
        <div className="gui-preview-dialog-shell">
          <header>
            <span id={`gui-preview-dialog-title-${id}`}>{name} preview</span>
            <button type="button" onClick={closePreview}>Close</button>
          </header>
          <div className="gui-preview-dialog-media">
            {preview.kind === "image" ? (
              <Image
                src={preview.src}
                alt={preview.alt}
                width={preview.width}
                height={preview.height}
                sizes="100vw"
              />
            ) : (
              <video
                ref={dialogVideoRef}
                aria-label={preview.alt}
                controls
                loop
                muted
                playsInline
                poster={preview.poster}
                preload="metadata"
              >
                <source src={preview.src} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
