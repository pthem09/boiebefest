import 'bootswatch/dist/superhero/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (usePassword) {
      // Option A: Standard Email + Password sign-in
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) setError(error.message);
    } else {
      // Option B: Passwordless Magic Link (sends a fresh login link to invited emails)
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: false, // Prevents uninvited strangers from creating accounts
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a login link!');
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Celebrate with Paul & Siman!</h2>
      <p>Please sign in with the email address that received your invitation.</p>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {usePassword && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              required
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', cursor: 'pointer' }}
        >
          {loading ? 'Please wait...' : usePassword ? 'Sign In' : 'Send Login Link'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            setUsePassword(!usePassword);
            setError('');
            setMessage('');
          }}
          style={{ background: 'none', border: 'none', color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {usePassword ? 'Sign in with an email link instead' : 'Sign in with a password instead'}
        </button>
      </div>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'crimson', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}