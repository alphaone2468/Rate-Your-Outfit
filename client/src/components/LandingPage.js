import React from 'react'
import firstImage from '../images/one.jpg'
import "@fontsource/geist-sans";
import cameraIcon from '../images/camera_icon.png'
import ratingIcon from '../images/rating_icon.png'
import improvementIcon from '../images/improvement_icon.png'
import darkCameraIcon from '../images/dark_camera_icon.png'
import darkRatingIcon from '../images/dark_rating_icon.png'
import darkImprovementIcon from '../images/dark_improvement_icon.png'
import darkReviewIcon from '../images/dark_review_icon.png'


export default function LandingPage() {
  return (
      <div className='headingFont'>
          <div>
              <img src={firstImage} alt="" className='firstImage' loading='lazy' />

          </div>
          <div className="headingContent">
              <h1 className='heading'>RateYourOutfit</h1>
              <div style={{ height: "90vh" }} className='center'>
                  <div className='ta-c'>
                      <div className="tagLine">
                          <h1>Elevate Your Style</h1>
                          <h1>Today</h1>
                      </div>
                      <div className="tagLine tagLineContainer">
                          <h1 className='tagLineText'>Unlock the power of personal style with expert tips and trends </h1>
                          <h1 className='tagLineText'>tailored just for you, helping you shine with confidence . Discover the </h1>
                          <h1 className='tagLineText'>perfect blend of comfort, elegance,and individuality to redefine your wardrobe</h1>
                          <h1 className='tagLineText'> and express your true self effortlessly .</h1>
                      </div>
                      <div>
                          <button className="startNowButton headingFont">Discover Now</button>
                      </div>
                  </div>
              </div>
          </div>


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
      </div>
  )
}
