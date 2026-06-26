"use client";

import { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

const formatMmSs = (total: number): string => {
  const m = Math.floor(Math.max(0, total) / 60)
    .toString()
    .padStart(2, "0");
  const s = (Math.max(0, total) % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const CountdownTimer = ({ seconds, onComplete, className }: CountdownTimerProps) => {
  const [remaining, setRemaining] = useState(seconds);
  const completed = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    completed.current = false;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          if (!completed.current) {
            completed.current = true;
            onComplete?.();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [seconds, onComplete]);

  return (
    <span dir="ltr" className={className} aria-live="polite">
      {formatMmSs(remaining)}
    </span>
  );
};
