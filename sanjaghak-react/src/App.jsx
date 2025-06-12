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
import CategoryPage from './pages/productCategoryPage.jsx';
import AdminPage from './pages/adminPage.jsx';
import CartPage from './pages/CartPage';
import Aboutus from './pages/Aboutus.jsx';
import Contactus from './pages/Contactus.jsx';
import Rules from './pages/Rules.jsx';



function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/signin', '/signup', '/signinmobile', '/confirmCode'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="appContainer">
      {shouldHideNavbar && <ParticlesBackground />}


      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signinmobile" element={<SignInMobile />} />
        <Route path="/confirmCode" element={<ConfirmCode />} />
        <Route path="/Product" element={<Product />} />
        <Route path='/productCategory' element={<CategoryPage />} />
        <Route path='/Admin' element={<AdminPage />} />
        <Route path="/mycart" element={<CartPage />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/Contactus" element={<Contactus />} />

        <Route path="/rules" element={<Rules />} />
         

      </Routes>
    </div>
  );
}

export default App
