import { Link } from 'react-router-dom';

export default function Navbar() {

    return (
        <nav class="navbar navbar-expand-lg sticky-top bg-primary" data-bs-theme="dark">
            <a href="../" class="navbar-brand">Boiebefest 2027</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <Link className="nav-link" to="/">Details</Link>
                    </li>
                    <li class="nav-item">
                        <Link className="nav-link" to="/sign-in">Sign in</Link>
                    </li>
                    <li class="nav-item">
                        <Link className="nav-link" to="/rsvp">RSVP</Link>
                    </li>
                    <li class="nav-item">
                        <Link className="nav-link" to="/contact-us">Contact Us</Link>
                    </li>
                    
                </ul>
            </div>
        </nav>
    )

}