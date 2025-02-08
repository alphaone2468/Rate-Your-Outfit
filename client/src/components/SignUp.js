import React from 'react'
import { useState } from 'react'
import '../css/Login.css'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
export default function SignUp() {
    const [buttonCss, setButtonCss] = useState({
      boxShadow: "5px 5px black",
    });
  
    const handleSignup = () => {
      setButtonCss((prevStyle) => ({
        ...prevStyle,
        boxShadow: "0px 0px black",
        transform: "translate(6px, 6px)"
      }));
  
      setTimeout(()=>{
        setButtonCss((prevStyle) => ({
          ...prevStyle,
          boxShadow: "5px 5px black",
          transform: "translate(0px, 0px)"
        }));
      },150)
    };
  return (
    <>
    <Navbar/>
    <div className="login">
      {/* <div className="partion1"></div> */}
      <div className="partion2">
        <div className='login_content '>
            <p className='signIn_login'>SignUp</p>
        <input type="text" name="" id="" placeholder='alpha' />
        <input type="text" name="" id="" placeholder='alpha@gmail.com' />
        <input type="text" name="" id="" placeholder='************' />
        <button type='submit' className='login_button' style={buttonCss} onClick={handleSignup}>Signup</button>
        <Link to="/login" className='Sign_up_link'>Already have an account</Link>
        </div>
      </div>
    </div>
    </>
  )
}