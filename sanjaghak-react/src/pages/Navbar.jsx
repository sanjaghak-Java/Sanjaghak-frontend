import React from 'react';
import '/src/styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    
    const goToSignIn=()=>{
        navigate("/signin")
    }
    const goToproduct=()=> {
        navigate("/Product")
    }
    const goTomycart=()=> {
        navigate("/mycart")
    };

  return (
    <div className='navContainer'>
        <div className='upperNav'>
            <Link to="/">
                <img src="./src/assets/sanjaghak-logo.png" alt="" className='logo' />
            </Link>
            <div className="searchContainer">
                <button className="searchBtn">
                    <img src="./src/assets/search.png" alt="search" />
                </button>
                <input type="text" className="searchBar" placeholder="جستجو" />
            </div>

            <div className='userActions'>
                <button className='loginBtn'  onClick={goToSignIn}>ثبت نام<span className='space'>|</span>ورود</button>
                <button className='cartbutton' onClick={goTomycart}>
                    <img src="./src/assets/icons8-cart-64.png" alt="cart" className='cartIcon' />
                </button>
            </div>
        </div>

        <div className='lowerNav'>

             <div className='dropDownContainer'>
                 <Link className='item'>
                 <div className='itemContent'>        
                     <img src="./src/assets/justify.png" alt="" className='icon' />
                     <span className='itemText'>دسته بندی کالا ها</span>
                 </div>
                 </Link>

                 <div className='dropDown'>
                 <Link>a</Link>
                 <Link>a</Link>
                 <Link>a</Link>
                 </div>
             </div>

             <div className='navItem'>
                 <Link className='item'>
                 <div className='itemContent'>
                     <img src="./src/assets/cup-2.png" alt="" className='icon' />
                     <span className='itemText'>پرفروش‌ترین‌ها</span>
                 </div>
                 </Link>
             </div>

             <div className='navItem'>
                 <Link className='item'>
                 <div className='itemContent'>
                     <img src="./src/assets/icons8-new-32.png" alt="" className='icon' />
                     <span className='itemText'>جدید ترین</span>
                 </div>
                 </Link>
             </div>

             <button className='' onClick={goToproduct}>test</button>
        </div>

    </div>
  );
}

export default Navbar;