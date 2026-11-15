import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { supabase } from '../../supabaseClient'; // Adjust path to match your project
const ADMIN_EMAILS = ['pthem09@gmail.com', 'simanhuang90@gmail.com'];

export default function Navbar() {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // 1. Check current session on initial mount
        supabase.auth.getSession().then(({ data: { session } }) => {
        const email = session?.user?.email?.toLowerCase();
        setIsAdmin(Boolean(email && ADMIN_EMAILS.includes(email)));
        });

        // 2. Listen for login/logout changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const email = session?.user?.email?.toLowerCase();
        setIsAdmin(Boolean(email && ADMIN_EMAILS.includes(email)));
        });

        return () => subscription.unsubscribe();
    }, []);


    return (
        <nav class="navbar navbar-expand-lg sticky-top bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Boiebefest 2027</Link>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarResponsive"
                    aria-controls="navbarResponsive"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <Link className="nav-link" to="/">Details</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/rsvp">RSVP</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/contact-us">Contact Us</Link>
                        </li>

                        {/* Only visible to Paul & Siman */}
                        {isAdmin && (
                        <li className="nav-item">
                            <Link className="nav-link text-primary-secondary fw-semibold" to="/admin">
                            Guest List
                            </Link>
                        </li>
                        )}
                        
                    </ul>
                </div>
            </div>
        </nav>
    )

}