import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    
    const goToSignIn=()=>{
        navigate("/signin")
    }
                const goTocart=()=> {
                    navigate("/cart")
                }

  return (
    <div className='navContainer'>
        <div className='upperNav'>
         <img src="./src/assets/sanjaghak-logo.png" alt="" className='logo' />

         <div className='searchContainer'>
         <button className='searchBtn'>جستجو</button>
         <input type='text' placeholder='جستجو' className='searchBar' />
         </div>

        <div className='userActions'>
            <button className='loginBtn'  onClick={goToSignIn}>ثبت نام | ورود</button>
         <img src="./src/assets/sanjaghak-logo.png" alt="" className='cartIcon' />
        </div>
        </div>
        <div className='lowerNav'>
            <div className='dropDownContainer'>
                <img className='icon'/>
               <Link className='item'>categories</Link>
                <div className='dropDown'>
                    <Link>a</Link>
                     <Link>a</Link>
                     <Link>a</Link>
                </div>

            </div>
             <div>
               <img className='icon'/>
               <Link className='item'>bestseller</Link>

             </div>
             
              <div>
              <img className='icon'/>
              <Link className='item'>something</Link>



              </div>

  
              <button className=''  onClick={goTocart}>test</button>
        </div>
    </div>
  );
}

export default Navbar;