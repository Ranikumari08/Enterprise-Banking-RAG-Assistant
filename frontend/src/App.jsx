import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
import About from './pages/About';
import Application from './pages/Application';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="blob-bg bg-primary/5 w-[500px] h-[500px] -top-40 -left-20"></div>
                <div className="blob-bg bg-accent-light/20 w-[600px] h-[600px] top-1/3 -right-60" style={{ animationDelay: '2s' }}></div>
                <div className="blob-bg bg-primary/5 w-[400px] h-[400px] bottom-0 -left-32" style={{ animationDelay: '4s' }}></div>

                <Navbar />
                <main className="flex-grow z-10 relative">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/apply" element={<Application />} />
                    </Routes>
                </main>
                <Footer />
                <Chatbot />
            </div>
        </Router>
    );
}

export default App;
