"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export function useSession() {
  const router = useRouter();
  const lastActivityRef = useRef(Date.now());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('holdvera_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.sessionExpired) {
        localStorage.removeItem('holdvera_token');
        localStorage.removeItem('holdvera_user');
        router.push('/login?expired=true');
        return;
      }

      // Check KYC status
      if (data.user?.role === 'USER' && data.user?.kycStatus !== 'APPROVED') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/kyc') && !currentPath.includes('/settings')) {
          router.push('/dashboard/kyc');
        }
      }
    } catch {
      // Network error, don't log out
    }
  }, [router]);

  useEffect(() => {
    // Add activity listeners
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Start session check interval
    checkIntervalRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    // Initial check
    checkSession();

    return () => {
      // Cleanup
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [updateActivity, checkSession]);

  return { updateActivity };
}
