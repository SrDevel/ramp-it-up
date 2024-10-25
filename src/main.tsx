import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from "./pages/App.tsx";
import AboutUs from "./pages/AboutUs.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<AboutUs />} />
            </Routes>
        </Router>
    </StrictMode>
);
