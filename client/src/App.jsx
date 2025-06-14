import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Search from './components/Search'
import SignUp from './components/SignUp'
import Upload from './components/Upload'
import Profile from './components/Profile'
import 'react-toastify/dist/ReactToastify.css';
import {Routes,Route,Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
function App() {

  const notifyCustomError = () => toast.error("This is a custom error message !", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  const notifyCustomSuccess = () => toast.success("This is a custom success message !", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  const notifyCustomWarning = () => toast.warn("This is a custom warning message !", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  const notifyCustomInfo = () => toast.info("This is a custom info message !", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  const notifyCustomDark = () => toast.dark("This is a custom dark message !", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  return (
    <>
      
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
      </Routes>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* <Login/> */}
      {/* <SignUp/> */}
      {/* <Upload/> */}
      

      {/* <Home/> */}

      {/* <Search/> */}
    </>
  )
}

export default App
