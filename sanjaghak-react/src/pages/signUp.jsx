import React from 'react';
import { Link } from 'react-router-dom';
import './signUp.css';

function signUp(){
    const handleSubmit=(e) =>{
        console.log("submitted")
    }
  return (
    <form className='signUpBox' onSubmit={handleSubmit}>
        <h1>ثبت نام</h1>
        <input className='signUpInput' type='text' required placeholder='نام'></input><br></br>
         <input className='signUpInput'  type='text' required placeholder='نام خانوادگی'></input><br></br>
        <input className='signUpInput'  type="tel" pattern="^09\d{9}$" required inputMode='numeric' placeholder='شماره موبایل'/><br></br>
        <input className='signUpInput'  type='email' required placeholder='ایمیل'></input><br></br>
        <button className='signUpButton' type='submit'>ثبت نام</button>
    </form>
  );
}

export default signUp;