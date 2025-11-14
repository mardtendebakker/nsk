import { useEffect, useRef } from 'react';
import useSecurity from './useSecurity';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export default function useInactivityTimer() {
  const { state: { user }, signOut } = useSecurity();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (user) {
      timeoutRef.current = setTimeout(() => {
        signOut();
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return undefined;
    }

    resetTimer();

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, signOut]);
}
