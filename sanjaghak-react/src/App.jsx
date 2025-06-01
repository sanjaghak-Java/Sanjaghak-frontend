import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';
import ParticlesBackground from './ParticlesBackground.jsx';
import './App.css';

function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/signin', '/signup'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="appContainer">
      <ParticlesBackground /> 

      {!shouldHideNavbar && (
        <nav className="navbar">
          <Link to="/signin">Sign In</Link> | <Link to="/signup">Sign Up</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<h1>Welcome Home</h1>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App
