import { useState, useEffect, useCallback, useRef } from "react";

interface CountdownReturn {
  seconds: number;
  isRunning: boolean;
  formatted: string;
  reset: (newSeconds?: number) => void;
}

export function useCountdown(initialSeconds: number): CountdownReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = seconds > 0;

  useEffect(() => {
    if (seconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [seconds > 0]);

  const reset = useCallback(
    (newSeconds?: number) => {
      setSeconds(newSeconds ?? initialSeconds);
    },
    [initialSeconds],
  );

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${minutes}:${secs.toString().padStart(2, "0")}`;

  return { seconds, isRunning, formatted, reset };
}
