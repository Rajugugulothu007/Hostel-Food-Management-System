import { useEffect, useRef } from "react";

/**
 * Runs `callback` immediately, then every `intervalMs`.
 * Pauses polling when the browser tab is hidden.
 */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  deps: any[] = []
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      if (document.hidden) return;
      await savedCallback.current();
    };

    tick();
    const id = setInterval(tick, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, ...deps]);
}