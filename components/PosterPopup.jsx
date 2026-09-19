'use client';

import { useEffect, useRef, useState } from 'react';

const POSTER_SRC = '/assets/hiring-poster.jpeg';

export default function PosterPopup() {
  const dialogRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);

  useEffect(() => {
    // Mounted only after the preloader has fully faded out.
    const timer = window.setTimeout(() => setDelayElapsed(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Start the five seconds only after the poster is ready to display.
    const image = new Image();
    image.onload = () => setReady(true);
    image.src = POSTER_SRC;
    return () => { image.onload = null; };
  }, []);

  useEffect(() => {
    if (!ready || !delayElapsed) return;

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    function restorePage() {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    const timer = window.setTimeout(() => dialog.close(), 5000);
    dialog.addEventListener('close', restorePage);
    return () => {
      window.clearTimeout(timer);
      dialog.removeEventListener('close', restorePage);
      if (dialog.open) dialog.close();
      restorePage();
    };
  }, [ready, delayElapsed]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="CrashConnect internship announcement"
      className="fixed inset-0 z-[70] m-auto max-h-[88dvh] w-max max-w-[94vw] overflow-hidden rounded-xl border border-line bg-bg p-3 text-soft shadow-2xl backdrop:bg-black/80 md:max-w-[90vw]"
    >
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          autoFocus
          onClick={() => dialogRef.current.close()}
          className="min-h-11 rounded-full border border-lineStrong px-4 text-sm hover:border-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
          aria-label="Close poster"
        >
          Close ×
        </button>
      </div>
      {ready && (
        <img
          src={POSTER_SRC}
          alt="Crash Connect is hiring interns in PCB design, IoT and embedded hardware, and full-stack development. Work from home, unpaid internship, certificate provided, Trichy candidates preferred. Apply at catscrashconnect@gmail.com or call 8680021912."
          className="block h-auto max-h-[calc(88dvh-5.125rem)] w-auto max-w-[calc(94vw-1.625rem)] object-contain md:max-w-[calc(90vw-1.625rem)]"
        />
      )}
    </dialog>
  );
}
