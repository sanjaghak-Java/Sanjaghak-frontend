import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';
import SignInMobile from "./pages/signInMobile.jsx"
import ConfirmCode from './pages/confirmCode.jsx';
import ParticlesBackground from './ParticlesBackground.jsx';
import './App.css';
import Product from './pages/Product.jsx';
import MainPage from './pages/mainPage.jsx';

function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/signin', '/signup','/signinmobile','/confirmCode'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="appContainer">
      {shouldHideNavbar && <ParticlesBackground />}
      

      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
       <Route path="/signinmobile" element={<SignInMobile/>} />
         <Route path="/confirmCode" element={<ConfirmCode/>} />
         <Route path="/Product" element={<Product/>} />

      </Routes>
    </div>
  );
}

export default App
