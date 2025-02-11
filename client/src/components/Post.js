import React from 'react';
import Navbar from './Navbar';
import '../css/Home.css'
import profile from '../images/man.png'
import one from '../images/one.jpg'

function Home(){
    const data=[
        {
            owner:"john1",
            rating:4
        },
        {
            owner:"john2",
            rating:1
        },
        {
            owner:"john3",
            rating:6
        },
        {
            owner:"john5",
            rating:2
        },
        {
            owner:"john10",
            rating:9
        }
    ]
    return (
        <>
        <Navbar/>
        <div className="content_container">
        <div className="content">
        {
            data.map((e)=>{
                return <>
                    <div className="card">
                    <div className="header">
                        <img src={profile} alt="" className='profile' />
                        <p className='font'>{e.owner}</p>
                    </div>
                        <img src={one} alt="" className='post' />
                        <p className='font'>{e.rating}</p>
                    </div>
                </>
            })
        }
        </div>
        </div>
        </>
    )
}
export default Home;