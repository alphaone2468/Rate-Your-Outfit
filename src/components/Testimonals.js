// src/TestimonialSlider.js
import React, { useState } from 'react';
import image from '../images/one.jpg'

const testimonials = [
    {
        name: 'John Doe',
        review: 'This is the best service I have ever used!',
        image: 'https://via.placeholder.com/100', // Placeholder image
    },
    {
        name: 'Jane Smith',
        review: 'Amazing experience, highly recommend!',
        image: 'https://via.placeholder.com/100', // Placeholder image
    },
    {
        name: 'Alice Johnson',
        review: 'I will definitely be coming back!',
        image: 'https://via.placeholder.com/100', // Placeholder image
    },
];

const TestimonialSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="testimonial-slider">
            <div className="testimonial">
                <img src={image} alt={testimonials[currentIndex].name} className="testimonial-image" />
                <p className="testimonial-review">"{testimonials[currentIndex].review}"</p>
                <h3 className="testimonial-name">{testimonials[currentIndex].name}</h3>
            </div>
            <button className="prev arrows" onClick={prevTestimonial}>&#10094;</button>
            <button className="next arrows" onClick={nextTestimonial}>&#10095;</button>
        </div>
    );
};

export default TestimonialSlider;