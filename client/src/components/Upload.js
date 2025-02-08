import React, { useState } from 'react'
import photo from "../images/one.jpg"
import { Link } from 'react-router-dom'
import '../css/Upload.css'
import Navbar from './Navbar'

export default function About() {
  const [string,setstring]=useState("")
  const [img,setimg]=useState("")
  const [loading,setloading]=useState(false);
  //console.log(img);
  async function callme(e) {
    const file=e.target.files[0];
    const base64=await convertToString(file);
    //console.log(base64)
    setimg(base64)
    document.getElementById("hidemeinstart").style.display="block";
    document.getElementById("hideme").style.display="none";
    setstring(base64)
  }
  async function handlesubmit(e) {
    setloading(true);
    const obj={
        owner:localStorage.getItem("ryo"),
        image:string,
        ratings:1,
        comments:[{ratings:[]},{count:0}]

    }
    const f=await fetch("http://localhost:5000/postimage",{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    })
    const res=await f.json()
    //console.log(res)
    if(res.success=="up"){
      //console.log("calling ")
      document.getElementById("successUpload").style.display="block";
      document.getElementById("hideme").style.display="block";
      setloading(false);
    }
    
    //console.log(obj)
  }
  return (
    <div>
      <Navbar/>
      <div className='upload'>
      <h1 className='ta-c headingFont'>Upload Your Image</h1>
        <label htmlFor="file-upload" className='makecorrect'>
        <div className='file_upload_text'>
          Choose A File
        </div>
        </label>
      <input type="file" name="ima" id="file-upload" accept='.jpg,.jepg,.png' onChange={callme} style={{"display":"none"}}/>
      <img src={img} alt="" className='postimage someMarginInLeftAndRight none' id="hidemeinstart"/>
      <p id="successUpload" className='none makecenter2 makebold1'><strong>Image Posted Successfully</strong></p>
      {(loading)? <p className='aligncenter'><strong>posting.....</strong></p>:""}
      <div className="butcon">
      <button onClick={handlesubmit} className='makebold'>Submit</button>
      </div>
      </div>
    </div>
  )
}

function convertToString(file){
  //console.log("calling")
  return new Promise((resolve,reject)=>{
    const fileReader=new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload=()=>{
      resolve(fileReader.result)
    }
    fileReader.onerror=(error)=>{
      reject(error)
    }

  })

}