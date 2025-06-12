import React from 'react';
import '/src/styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/sanjaghak-logo.png';
import searchIcon from '../assets/search.png';
import cartIcon from '../assets/icons8-cart-64.png';
import justifyIcon from '../assets/justify.png';
import newIcon from '../assets/icons8-new-32.png';
import cupIcon from '../assets/cup-2.png';

function Navbar() {
    const navigate = useNavigate();

    const goToSignIn = () => {
        navigate("/signin");
    };
    const goToproduct = () => {
        navigate("/Product");
    };
    const goTomycart = () => {
        navigate("/mycart");
    };

    return (
        <div className='navContainer'>
            <div className='upperNav'>
                <Link to="/">
                    <img src="./src/assets/sanjaghak-logo.png" alt="" className='logonav' />
                </Link>
                <div className="searchContainer">
                    <button className="searchBtn">
                        <img src={searchIcon} alt="search" />
                    </button>
                    <input type="text" className="searchBar" placeholder="جستجو" />
                </div>

                <div className='userActions'>
                    <button className='loginBtn' onClick={goToSignIn}>ثبت نام<span className='space'>|</span>ورود</button>
                    <div className='cart-navbar'>
                        <button className='cartbutton' onClick={goTomycart}>
                            <label htmlFor="" className='cart-num'>1</label>
                            <img src={cartIcon} alt="cart" className='cartIcon' />
                        </button>
                    </div>
                </div>
            </div>

            <div className='lowerNav'>
                <div className='dropDownContainer'>
                    <Link className='itemnav'>
                        <div className='itemContentnav'>
                            <img src="./src/assets/justify.png" alt="" className='iconnav' />
                            <span className='itemTextnav'>دسته بندی کالا ها</span>
                        </div>
                    </Link>

                    <div className="dropDown">
                        <Link>a</Link>
                        <Link>a</Link>
                        <Link>a</Link>
                    </div>
                </div>

                <div className='navItem'>
                    <Link to="/#newest" className='itemnav'>
                        <div className='itemContentnav'>
                            <img src="./src/assets/icons8-new-32.png" alt="" className='iconnav' />
                            <span className='itemTextnav'>جدید ترین</span>
                        </div>
                    </Link>
                </div>

                <div className='navItem'>
                    <Link to="/#bestseller" className='itemnav'>
                        <div className='itemContentnav'>
                            <img src="./src/assets/cup-2.png" alt="" className='iconnav' />
                            <span className='itemTextnav'>پرفروش ترین‌ها</span>
                        </div>
                    </Link>
                </div>

                <button className='' onClick={goToproduct}>test</button>
            </div>
        </div>
    );
}

export default Navbar;
