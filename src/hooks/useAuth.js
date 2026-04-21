import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

// Wrap any promise with a timeout. If it doesn't resolve in `ms`, rejects with a timeout error.
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)),
  ]);
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Global safety net: force loading off after 15s no matter what.
    const hardTimeout = setTimeout(() => {
      if (!cancelled) {
        console.warn('useAuth hard timeout — forcing loading=false');
        setLoading(false);
      }
    }, 15000);

    (async () => {
      try {
        const { data: { session } } = await withTimeout(supabase.auth.getSession(), 8000, 'getSession');
        if (cancelled) return;
        if (session?.user) {
          await loadProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('getSession failed:', err);
        if (!cancelled) setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (ev, session) => {
      if (cancelled) return;
      if ((ev === 'SIGNED_IN' || ev === 'INITIAL_SESSION' || ev === 'TOKEN_REFRESHED') && session?.user) {
        await loadProfile(session.user);
      } else if (ev === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => { cancelled = true; clearTimeout(hardTimeout); subscription.unsubscribe(); };
  }, []);

  async function loadProfile(au) {
    const fallback = {
      id: au.id,
      email: au.email,
      display_name: au.user_metadata?.full_name || au.email?.split('@')[0] || '',
      initials: (au.user_metadata?.full_name || au.email?.split('@')[0] || 'U').slice(0, 2).toUpperCase(),
      avatar_url: au.user_metadata?.avatar_url || null,
    };
    try {
      let profile = null;
      for (let i = 0; i < 3; i++) {
        try {
          const { data, error } = await withTimeout(
            supabase.from('profiles').select('*').eq('id', au.id).maybeSingle(),
            6000,
            `profile query attempt ${i + 1}`
          );
          if (error) {
            console.error(`loadProfile attempt ${i + 1} error:`, error);
            break;
          }
          if (data) { profile = data; break; }
        } catch (attemptErr) {
          console.error(`loadProfile attempt ${i + 1} exception:`, attemptErr);
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
      setUser(profile || (console.warn('Profile not found — using auth metadata fallback'), fallback));
    } catch (err) {
      console.error('loadProfile failed:', err);
      setUser(fallback);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { queryParams: { hd: 'bono.ro' }, redirectTo: window.location.origin },
    });
    if (error) console.error('Login error:', error);
  }

  async function signOut() { await supabase.auth.signOut(); setUser(null); }

  async function updateDisplayName(n) {
    if (!user) return;
    const { error } = await supabase.from('profiles')
      .update({ display_name: n, initials: n.slice(0, 2).toUpperCase() }).eq('id', user.id);
    if (!error) setUser(p => ({ ...p, display_name: n, initials: n.slice(0, 2).toUpperCase() }));
  }

  return { user, loading, signInWithGoogle, signOut, updateDisplayName };
}
