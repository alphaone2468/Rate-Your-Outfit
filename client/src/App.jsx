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
import toast, { Toaster } from 'react-hot-toast';
import Comments from './components/Comments'
function App() {

  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            // some dark green color
            padding: '10px 35px',
            fontSize: '17px',
            fontFamily: 'Lato, sans-serif',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'lightgray', //more light color
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed89',
            },
          },
        }}
        
      
      />
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
        <Route path='/comments/:id' element={<Comments/>}/>
      </Routes>



      {/* <Login/> */}
      {/* <SignUp/> */}
      {/* <Upload/> */}
      

      {/* <Home/> */}

      {/* <Search/> */}
    </>
  )
}

export default App
