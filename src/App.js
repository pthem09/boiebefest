import 'bootswatch/dist/superhero/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

import Home from "./Components/Pages/Home";
import RSVP from './Components/Pages/RSVP';
import ContactUs from './Components/Pages/ContactUs';
import Navbar from './Components/Navbar/Navbar';
import LoginPage from './LoginPage';

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Check active session (also detects tokens when clicking email invite links)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    // 2. Listen for sign-in and sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {!session ? (
        /* Unauthenticated visitors only see the Login landing page */
        <LoginPage />
      ) : (
        /* Authenticated guests see the Navbar and full site */
        <>
          <Navbar session={session} />
          <Routes>
            <Route path="/" element={<Home session={session} />} />
            <Route path="/rsvp" element={<RSVP session={session} />} />
            <Route path="/contact-us" element={<ContactUs />} />
            {/* Redirect /sign-in or any unknown path to Home once logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}
