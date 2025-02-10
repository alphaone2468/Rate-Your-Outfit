import React, { useState } from 'react'
import photo from "../images/one.jpg"
import { Link } from 'react-router-dom'
import '../css/Upload.css'
import Navbar from './Navbar'

export default function About() {
  const [string,setstring]=useState("")
  const [img,setimg]=useState("")
  const [loading,setloading]=useState(false);
    const [buttonCss, setButtonCss] = useState({
      boxShadow: "5px 5px black",
    });
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
  async function handleSubmit() {
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
  }
  return (
    <div className='navbarContainer'>
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
      <div className="uploadContainer">
      <button onClick={handleSubmit} className='upload_button' style={buttonCss}>Submit</button>
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