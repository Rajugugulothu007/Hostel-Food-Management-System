import { useEffect, useState } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function compute(targetMs: number): Countdown {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

/**
 * Live countdown to a target date. Updates every second.
 */
export function useCountdown(target: string | Date | null | undefined): Countdown {
  const targetMs = target ? new Date(target).getTime() : 0;
  const [state, setState] = useState<Countdown>(() => compute(targetMs));

  useEffect(() => {
    if (!targetMs) return;
    setState(compute(targetMs));
    const id = setInterval(() => setState(compute(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return state;
}