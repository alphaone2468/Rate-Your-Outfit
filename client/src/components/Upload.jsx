import { useState, useEffect } from "react";
import "../styles/Upload.css";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [img,setImg]=useState("");
  const [loading,setLoading]=useState(false);
  const [uploadBtnStyle,setUploadBtnStyle]=useState({
      boxShadow:"6px 6px black",
    })

    const navigate = useNavigate();




  const handlePreviewImage = async(e) =>{
    const file=e.target.files[0];
    if(file.size > 10*1024*1024){ 
      toast.error("File size exceeds 10MB limit");
      return;
    }
    const base64=await convertToString(file);
    console.log(base64);
    setImg(base64);
  }

  function convertToString(file){
  console.log("calling")
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

const handleRemoveImg=()=>{
  setImg("")
}

const handleUploadImage = async()=>{
  setUploadBtnStyle(()=>{return {boxShadow:"0px 0px black",transform:"translate(5px,5px)"}});
    
  setTimeout(()=>{
    setUploadBtnStyle(()=>{return {boxShadow:"6px 6px black"}});
    },100)
  setLoading(true);
  let imgData={
    userId:"123",
    userName:"test",
    image:img
  }
  let data = await fetch("http://localhost:5000/api/post/addPost",{
    method:"POST",
    body:JSON.stringify(imgData),
    credentials:"include",
    headers:{
      'Content-Type':'application/json'
    }
  })
  data = await data.json();

  console.log(data);
  setLoading(false);

  if(data.status==="SUCCESS"){
    console.log("Post created successfully");
    setImg("");
    toast.success("Image uploaded successfully");
  }
  else{
    toast.error("Failed to upload image");
  }

}
  return (
    <div className="uploadContainer">
      <h1 className="heading text-center uploadImageText">Upload Image</h1>
      <p className="text-center uploadText2">Select an Image to Upload</p>
      <div className="uploadImgContainer">
        <div className="innerUploadImgContainer">
          <div className="content">
            <div className="uploadIconContainer">
              <label htmlFor="file-upload" className="uploadIcon">
                <input type="file" id="file-upload" onChange={handlePreviewImage} style={{display:"none"}}/>
                <MdOutlineDriveFolderUpload
                  style={{ color: "#669", fontSize: "40px" }}
                />
              </label>
            </div>

            <div>
              <p className="clickContent">Click to upload Image</p>
              <p className="imagesSupport">PNG,JPG,GIF upto 10MB</p>
            </div>
          </div>
        </div>
        {(img) && 
        <div className="previewImgContainter">
          <div className="previewText">
          <h1>Preview</h1>
          <div className="">
          <CiCircleRemove style={{fontSize:"30px",fontWeight:"900",cursor:"pointer"}} onClick={handleRemoveImg}/>
          </div>
          </div>
          <div className="flexCenter">
          <img src={img} alt="" className="previewImg"/>
          </div>
        </div>
        }
      </div>
      {(img) && 
      <div className="uploadBtnContainer">
        <button className="uploadBtn cp" onClick={handleUploadImage} style={uploadBtnStyle}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      }
    </div>
  );
}





//       async function callme(e) {
//     const file=e.target.files[0];
//     const base64=await convertToString(file);
//     console.log(base64)
//     setimg(base64)
//     document.getElementById("hidemeinstart").style.display="block"
//     setstring(base64)
//   }




  
