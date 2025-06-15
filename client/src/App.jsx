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
function App() {

  return (
    <>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
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
