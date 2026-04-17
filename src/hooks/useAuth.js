import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { loadProfile(session.user); } else { setLoading(false); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (ev, session) => {
      if (ev === 'SIGNED_IN' && session?.user) await loadProfile(session.user);
      else if (ev === 'SIGNED_OUT') setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(au) {
    let profile = null;
    for (let i = 0; i < 3; i++) {
      const { data } = await supabase.from('profiles').select('*').eq('id', au.id).single();
      if (data) { profile = data; break; }
      await new Promise(r => setTimeout(r, 500));
    }
    if (profile) { setUser(profile); } else {
      setUser({ id: au.id, email: au.email,
        display_name: au.user_metadata?.full_name || au.email?.split('@')[0] || '',
        initials: (au.user_metadata?.full_name || au.email?.split('@')[0] || 'U').slice(0,2).toUpperCase(),
        avatar_url: au.user_metadata?.avatar_url || null });
    }
    setLoading(false);
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
      .update({ display_name: n, initials: n.slice(0,2).toUpperCase() }).eq('id', user.id);
    if (!error) setUser(p => ({ ...p, display_name: n, initials: n.slice(0,2).toUpperCase() }));
  }

  return { user, loading, signInWithGoogle, signOut, updateDisplayName };
}
