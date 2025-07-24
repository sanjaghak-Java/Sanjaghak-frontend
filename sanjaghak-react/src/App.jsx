import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';
import SignInMobile from "./pages/signInMobile.jsx";
import ConfirmCode from './pages/confirmCode.jsx';
import ParticlesBackground from './ParticlesBackground.jsx';
import './App.css';
import Product from './pages/Product.jsx';
import MainPage from './pages/mainPage.jsx';
import CategoryPage from './pages/productCategoryPage.jsx';
import CartPage from './pages/CartPage';
import Aboutus from './pages/Aboutus.jsx';
import Contactus from './pages/Contactus.jsx';
import Rules from './pages/Rules.jsx';
import FAQPage from './pages/FAQPage.jsx';
import Orders from './pages/Orders.jsx';
import ProfileEdit from './pages/ProfileEdit';
import ProfileFavorite  from './pages/ProfileFavorite.jsx';
import Filter  from './pages/Filter.jsx';



import AdminLayout from './pages/adminLayout.jsx';
import FinancialReport from './pages/FinancialReport.jsx';
import AddProduct from './pages/AddProduct.jsx';
import AddBrand from './pages/AddBrand.jsx';
import AddCategory from './pages/addCategory.jsx';
import UserList from './pages/UserList.jsx';
import ProductList from './pages/ProductList.jsx';
import AddManager from './pages/AddManager.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminCategoryList from './pages/AdminCategoryList.jsx';
import AdminBrandList from './pages/AdminBrandList.jsx';
import EmployeeList from './pages/EmployeeList.jsx';
import EditCategoryAttributes from './pages/CategoryAttributes.jsx';
import AdminBrandDetail from './pages/AdminBrandDetail.jsx';

const products = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: 1000*i,
  category: "Category 1",
  brand: "Brand X",
  image: "/src/assets/testimage.jpg",
  description: "Some description",
}));

function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/signin', '/signup', '/signinmobile', '/confirmCode'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname.toLowerCase());

  return (
    <div className="appContainer">
      {shouldHideNavbar && <ParticlesBackground />}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signinmobile" element={<SignInMobile />} />
        <Route path="/confirmCode" element={<ConfirmCode />} />
        <Route path="/product" element={<Product/>} />
        <Route path="/productCategory" element={<CategoryPage />} />
        <Route path="/mycart" element={<CartPage />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/faqpage" element={<FAQPage />} />
        <Route path="/profile-orders" element={<Orders />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/profile-favorites" element={<ProfileFavorite />} />
        <Route path="/Filter" element={<Filter />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="داشبورد" element={<Dashboard />} />
          <Route path="گزارش مالی" element={<FinancialReport />} />
          <Route path="افزودن محصول" element={<AddProduct />} />
          <Route path="لیست کارکنان" element={<EmployeeList />} />
          <Route path="لیست دسته ها" element={<AdminCategoryList />} />
          <Route path="لیست کاربران" element={<UserList />} />
          <Route path="لیست محصولات" element={<ProductList products={products} />} />
          <Route path="لیست برند ها" element={<AdminBrandList />} />
          <Route path="افزودن دسته" element={<AddCategory />} />
          <Route path="افزودن برند" element={<AddBrand />} />
           <Route path="افزودن کارمند" element={<AddManager />} />
          <Route path="/admin/category/:id/attributes" element={<EditCategoryAttributes />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;