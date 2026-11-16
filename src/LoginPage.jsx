import 'bootswatch/dist/superhero/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('signups not allowed')) {
        setError(
          'Your account has not been activated yet. Please click the original invitation link sent to your email first (check your spam folder if needed).'
        );
      } else {
        setError(error.message);
      }
    } else {
      setMessage('Check your email for a login link!');
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

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', cursor: 'pointer' }}
        >
          {loading ? 'Please wait...' : 'Send Login Link'}
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'crimson', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}