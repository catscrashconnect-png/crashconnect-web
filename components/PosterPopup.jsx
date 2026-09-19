'use client';

import { useEffect, useRef } from 'react';

const POSTER_SRC = '/assets/hiring-poster.png';
let posterShownThisVisit = false;

export default function PosterPopup() {
  const dialogRef = useRef(null);

  useEffect(() => {
    // Survives component remounts; a full page reload resets this module.
    if (posterShownThisVisit) return;

    const dialog = dialogRef.current;
    const image = new Image();
    let imageReady = false;
    let delayElapsed = false;
    let disposed = false;
    let opened = false;
    let closeTimer;
    let previousFocus;
    let previousOverflow;

    function restorePage() {
      if (!opened) return;
      opened = false;
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    function finish() {
      window.clearTimeout(delayTimer);
      window.clearTimeout(closeTimer);
      image.onload = null;
      image.onerror = null;
      restorePage();
    }

    function openOnce() {
      if (disposed || posterShownThisVisit || !imageReady || !delayElapsed) return;
      posterShownThisVisit = true;
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      opened = true;
      document.body.style.overflow = 'hidden';
      closeTimer = window.setTimeout(() => dialog.close(), 5000);
    }

    // Preloader mounts this component after its exit animation completes.
    const delayTimer = window.setTimeout(() => {
      delayElapsed = true;
      openOnce();
    }, 1000);

    dialog.addEventListener('close', finish);
    image.onload = () => {
      imageReady = true;
      openOnce();
    };
    image.onerror = finish;
    image.src = POSTER_SRC;

    return () => {
      disposed = true;
      dialog.removeEventListener('close', finish);
      if (dialog.open) dialog.close();
      finish();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="CrashConnect internship announcement"
      className="fixed inset-0 z-[70] m-auto max-h-[86dvh] w-max max-w-[94vw] overflow-hidden rounded-xl border border-line bg-bg p-3 text-soft shadow-2xl backdrop:bg-black/80 sm:max-h-[88dvh] sm:max-w-[90vw] lg:max-h-[90dvh] lg:max-w-[80vw] lg:p-1"
    >
      <div className="mb-3 flex justify-end lg:mb-1">
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
      <img
        src={POSTER_SRC}
        alt="Crash Connect is hiring interns in PCB design, IoT and embedded hardware, and full-stack development. Work from home, unpaid internship, certificate provided, Trichy candidates preferred. Apply at catscrashconnect@gmail.com or call 8680021912."
        className="block h-auto max-h-[calc(86dvh-5.125rem)] w-auto max-w-[calc(94vw-1.625rem)] object-contain sm:max-h-[calc(88dvh-5.125rem)] sm:max-w-[calc(90vw-1.625rem)] lg:max-h-[calc(90dvh-3.625rem)] lg:max-w-[calc(80vw-0.625rem)]"
      />
    </dialog>
  );
}
