import React from 'react'
import '../css/Login.css'
import Navbar from './Navbar'
export default function Login() {
  return (
    <>
    <Navbar/>
    <div className="login">
      <div className="partion1"></div>
      <div className="partion2">
        <div className='login_content '>
            <p className='signIn_login'>SignIn</p>
        <input type="text" name="" id="" placeholder='abc@gmail.com' />
        <input type="text" name="" id="" placeholder='************' />
        <button type='submit' className='login_button'>login</button>
        </div>
      </div>
    </div>
    </>
  )
}

