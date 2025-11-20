import { useEffect, useRef } from 'react';
import useSecurity from './useSecurity';

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
      }, parseInt(process.env.INACTIVITY_TIMEOUT || '25', 10) * 60 * 1000);
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
