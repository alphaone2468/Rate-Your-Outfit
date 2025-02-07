import React from 'react'
import firstImage from '../images/one.jpg'
import secondImage from '../images/two.jpg'
import thirdImage from '../images/three.jpg'
import TestimonialSlider from './Testimonals'
import "@fontsource/geist-sans";

export default function LandingPage() {
  return (
    <div className='headingFont'>
        <div>
        <img src={firstImage} alt="" className='firstImage'/>

        </div>
        <div className="headingContent">
        <h1 className='heading'>RateYourOutfit</h1>
        <div style={{height:"90vh"}} className='center'>
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


        <div className='center'>
            <img src={secondImage} alt="" className='secondImage'/>
        </div>
        <div className="about">
            <div style={{display:"grid",gridGap:"60px"}}>
            <h1>About Rate Your Outfit</h1>
            <div className='about-line'></div>
            <p>Rate Your Outfit is a  platform where fashion enthusiasts can upload their photos and receive ratings from fellow users on a scale of 10. Whether you're seeking fashion advice or just curious about how others perceive your style, Rate Your Outfit offers a fun and interactive way to connect with the fashion community.</p>
            </div>
        </div>
        <div>
            <img src={thirdImage} alt="" className='thirdImage' />
        </div>
        <div className="about join">
            <div style={{display:"grid",gridGap:"60px"}}>
            <h1>Join the Trendsetters!</h1>
            <div className='about-line'></div>
            <p>Unleash your creativity by uploading your unique style, rating your favorite looks, and shining bright in the world of fashion. Be part of a vibrant community where individuality meets inspiration, and let your style make a statement that turns heads!</p>
            </div>
        </div>
        <div className='center'>
            <div>
                <p className='services_heading'>SERVICES</p>
                <div style={{padding:"0px 20px"}}>
                <div className='about-line services_line'></div>
                </div>
            </div>
        </div>
        <div className="services">
            <div className="services-card1">
                <div className="center">
                <img src={firstImage} alt="" className='services_img' />
                </div>
                <h1>Heading</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis modi consequuntur est, suscipit quam, quasi quia ducimus itaque eius ullam eveniet voluptate magni ea in rem maxime? Sunt, quae ipsum?</p>
            </div>
            <div className="services-card2">
                <div className="center">
                <img src={firstImage} alt="" className='services_img' />
                </div>
                <h1>Heading</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis modi consequuntur est, suscipit quam, quasi quia ducimus itaque eius ullam eveniet voluptate magni ea in rem maxime? Sunt, quae ipsum?</p>
            </div>
            <div className="services-card3">
                <div className="center">
                <img src={firstImage} alt="" className='services_img'/>
                </div>
                <h1>Heading</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis modi consequuntur est, suscipit quam, quasi quia ducimus itaque eius ullam eveniet voluptate magni ea in rem maxime? Sunt, quae ipsum?</p>
            </div>
        </div>

        <div className='center'>
            <div>
                <p className='testimonial_heading'>TESTIMONIALS</p>
                <div style={{padding:"0px 20px"}}>
                <div className='about-line testimonial_line'></div>
                </div>
            </div>
        </div>
        <TestimonialSlider/>
        
        <div className='center'>
            <div>
                <p className='contact_heading'>CONTACT</p>
                <div style={{padding:"0px 20px"}}>
                <div className='about-line contact_line'></div>
                </div>
            </div>
        </div>

        <div className="contact center">
            <div className='contact_inputFields'>
            <div className='name_phone_fields'>
            <input type="text" placeholder='Name'/>
            <input type="text" placeholder="Phone"/>
            </div>
            <div className='email_field_div'>
            <input type="text" placeholder="Email" className='email_field' />
            </div>
            <div className='email_field_div'>
            <textarea placeholder='Message' row="10" col="30" className='message_area'/>
            </div>
            <button className='contact_us_button'>CONTACT US</button>
            </div>
        </div>
    </div>
  )
}
