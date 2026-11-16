import 'bootswatch/dist/superhero/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

import Home from './Components/Pages/Home';
import RSVP from './Components/Pages/RSVP';
import ContactUs from './Components/Pages/ContactUs';
import AdminDashboard from './Components/Pages/AdminDashboard';
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './LoginPage';

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Surface any Supabase error returned in the URL hash/query (e.g. expired or scanned invite link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    const errorDescription =
      hashParams.get('error_description') || queryParams.get('error_description');

    if (errorDescription) {
      setAuthError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
    }

    // Rely exclusively on onAuthStateChange: Supabase JS v2 waits for URL token
    // exchange to finish before firing INITIAL_SESSION or SIGNED_IN.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setCheckingAuth(false);

      // Clean the #access_token hash from the URL once Supabase has consumed it
      if (
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
        currentSession &&
        window.location.hash.includes('access_token')
      ) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {!session ? (
        <>
          {authError && (
            <div className="container mt-3">
              <div className="alert alert-danger text-center">
                <strong>Invite Link Issue:</strong> {authError}
              </div>
            </div>
          )}
          <LoginPage />
        </>
      ) : (
        <>
          <Navbar session={session} />
          <Routes>
            <Route path="/" element={<Home session={session} />} />
            <Route path="/rsvp" element={<RSVP session={session} />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}