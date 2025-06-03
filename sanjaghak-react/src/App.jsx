import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';
import SignInMobile from "./pages/signInMobile.jsx"
import ConfirmCode from './pages/confirmCode.jsx';
import ParticlesBackground from './ParticlesBackground.jsx';
import './App.css';
import Navbar from './pages/navbar.jsx';
import Cart from './pages/cart.jsx';

function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/signin', '/signup','/signinmobile','/confirmCode'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="appContainer">
      <ParticlesBackground/>
      <Routes>
        <Route path="/" element={<Navbar/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
       <Route path="/signinmobile" element={<SignInMobile/>} />
         <Route path="/confirmCode" element={<ConfirmCode/>} />
         <Route path="/Cart" element={<Cart/>} />

      </Routes>
    </div>
  );
}

export default App
