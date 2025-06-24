import '../styles/Search.css'
import { IoMdSearch } from "react-icons/io";
export default function Search() {
  return (
    <div className='searchContainer'>
        <div className="searchMainElement">
            <div className="nameContainer" style={{position:"relative"}}>
                    <IoMdSearch style={{fontSize:"25px",position:"absolute",left:"35px",top:"30px"}}/>
                    <input type="text" id='username' className='userNameInput' placeholder='Search UserName'/>
                </div>
        </div>
    </div>
  )
}
