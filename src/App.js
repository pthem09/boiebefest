import 'bootswatch/dist/superhero/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Components/Pages/Home";
import SignIn from './Components/Pages/SignIn';
import RSVP from './Components/Pages/RSVP';
import ContactUs from './Components/Pages/ContactUs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}
