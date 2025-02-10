import React, { useEffect } from 'react'
import { useState } from 'react';
import firstImage from '../images/one.jpg'
import "@fontsource/geist-sans";
import cameraIcon from '../images/camera_icon.png'
import ratingIcon from '../images/rating_icon.png'
import improvementIcon from '../images/improvement_icon.png'
import darkCameraIcon from '../images/dark_camera_icon.png'
import darkRatingIcon from '../images/dark_rating_icon.png'
import darkImprovementIcon from '../images/dark_improvement_icon.png'
import darkReviewIcon from '../images/dark_review_icon.png'
import { useNavigate } from 'react-router-dom';


export default function LandingPage() {
      const [buttonCss, setButtonCss] = useState({
        boxShadow: "5px 5px black",
      });
      const navigate=useNavigate();
      
      const handleLogin = () => {
        setButtonCss((prevStyle) => ({
          ...prevStyle,
          boxShadow: "0px 0px black",
          transform: "translate(7px, 7px)"
        }));
    
        setTimeout(()=>{
          setButtonCss((prevStyle) => ({
            ...prevStyle,
            boxShadow: "5px 5px black",
            transform: "translate(0px, 0px)"
          }));
        },150)
      };

      const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navbg = document.querySelector('.nav-bg');

      function callme(){
        navbar.classList.toggle('active');
        navbg.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    }
  return (
      <div className='headingFont'>
          <div>
              <img src={firstImage} alt="" className='firstImage' loading='lazy' />
          </div>
          <div className="headingContent">
                <div className="headingInfo">
                    <h1 className='heading'>RateYourOutfit</h1>
                </div>
              <div style={{ height: "80vh" }} className='center'>
                  <div className='ta-c'>
                      <div className="tagLine">
                          <h1>Elevate Your Style with RateYourOutfit</h1>
                      </div>
                      <div className="tagLineContainer">
                          <p className='tagLineText'>Upload your outfit, get rated by the community, and improve your fashion sense. Join the style revolution today!</p>                        
                      </div>
                      <div>
                          <button className="startNowButton headingFont" onClick={()=>{navigate("/login")}} >Discover Now</button>
                      </div>
                  </div>
              </div>
          </div>

          <div className="background">

          <div className='features'>
            <h1>Key Features</h1>
            <div className='featuresContent'>
            <div className="box1">
                <img src={cameraIcon} alt="" className='cameraIcon icons'/>
                <h1 className='featureHeading'>Capture Your Style</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            <div className="box2">
                <img src={ratingIcon} alt="" className='ratingIcon icons' />
                <h1 className='featureHeading'>Community Ratings</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            <div className="box3">
                <img src={improvementIcon} alt="" className='improvementIcon icons' />
                <h1 className='featureHeading'>Get Personalized Feedback</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            </div>
          </div>


          <div className='features'>
            <h1>How It Works</h1>
            <div className='HIWContent'>
            <div className="box1HIW">
                <img src={darkCameraIcon} alt="" className='cameraIcon icons'/>
                <h1 className='featureHeading'>Capture Your Style</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            <div className="box2HIW">
                <img src={darkRatingIcon} alt="" className='ratingIcon icons' />
                <h1 className='featureHeading'>Community Ratings</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            <div className="box3HIW">
                <img src={darkImprovementIcon} alt="" className='improvementIcon icons' />
                <h1 className='featureHeading'>Get Personalized Feedback</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            
            <div className="box3HIW">
                <img src={darkReviewIcon} alt="" className='improvementIcon icons' />
                <h1 className='featureHeading'>Get Personalized Feedback</h1>
                <p className='featureContent'>Quickly upload your outfit photos with our user-friendly interface.</p>
            </div>
            </div>
          </div>



          <div className="contact">
            <h1 className='ta-c'>Get in Touch</h1>
            <p className='ta-c'>Have a question or want to learn more about our platform? We'd love to</p>
            <div className="contactInfo">
                <input type="email" name="" id="" placeholder='alpha@gmail.com' />
                <textarea type="message" name="" id="" placeholder='message' />
                <button className='contactUsButton' style={buttonCss} onClick={handleLogin}>submit</button>
            </div>
          </div>

          </div>
      </div>
  )
}
