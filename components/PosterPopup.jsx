'use client';

import { useEffect, useRef, useState } from 'react';

const POPUP_DELAY_MS = 1000;
const AUTO_CLOSE_MS = 5000;

export default function PosterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const showTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    const showPopup = () => {
      if (showTimerRef.current || isOpen) return;

      showTimerRef.current = window.setTimeout(() => {
        setIsOpen(true);
        showTimerRef.current = null;
      }, POPUP_DELAY_MS);
    };

    // Preferred path: Preloader dispatches this after its fade-out completes.
    const handleReady = () => showPopup();
    window.addEventListener('crashconnect:preloader-finished', handleReady);

    // If the preloader has already finished before this component mounted.
    if (window.__CRASHCONNECT_PRELOADER_FINISHED__) {
      showPopup();
    }

    // Safe fallback: if there is no preloader event for any reason,
    // wait until the full page load has completed, then show it.
    let fallbackTimer;
    const startFallback = () => {
      fallbackTimer = window.setTimeout(() => {
        if (!window.__CRASHCONNECT_PRELOADER_FINISHED__) showPopup();
      }, 5000);
    };

    if (document.readyState === 'complete') {
      startFallback();
    } else {
      window.addEventListener('load', startFallback, { once: true });
    }

    return () => {
      window.removeEventListener('crashconnect:preloader-finished', handleReady);
      window.removeEventListener('load', startFallback);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, AUTO_CLOSE_MS);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-[2px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="CrashConnect hiring poster"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div className="relative flex max-h-[96dvh] max-w-[96vw] items-center justify-center pt-11 sm:pt-12">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-0 top-0 z-10 rounded-full border border-cyan/70 bg-bg/95 px-4 py-2 text-sm font-medium text-white shadow-xl transition hover:border-cyan hover:bg-bg focus:outline-none focus:ring-2 focus:ring-cyan"
          aria-label="Close hiring poster"
        >
          Close ×
        </button>

        <img
          src="/assets/hiring-poster-web.webp"
          alt="Crash Connect Private Limited hiring interns poster"
          width="1280"
          height="1920"
          className="block h-auto w-auto max-h-[86dvh] max-w-[94vw] rounded-xl object-contain shadow-2xl sm:max-w-[90vw]"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
