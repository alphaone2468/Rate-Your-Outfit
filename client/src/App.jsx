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
import Loading from './components/Loading'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

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
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed89',
            },
            style: {
              color: 'green',
              // border: '1px solid green',
              backgroundColor:"#e7ffe7"
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: 'pink',
            },
            style: {
              color: 'red',
              backgroundColor:"#fedddd"

            },
          },
        }}
      />
      <Navbar/>
      <Routes>
        <Route path='/' element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>}
        />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/upload' element={<ProtectedRoute><Upload/></ProtectedRoute>}/>
        <Route path='/search' element={<ProtectedRoute><Search/></ProtectedRoute>}/>
        <Route path='/profile/:id' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/comments/:id' element={<ProtectedRoute><Comments/></ProtectedRoute>}/>
        <Route path="/loading" element={<Loading/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>


    </>
  )
}

export default App
