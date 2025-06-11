import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Search from './components/Search'
import SignUp from './components/SignUp'
import Upload from './components/Upload'
import {Routes,Route,Link} from 'react-router-dom';
function App() {
  
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/search' element={<Search/>}/>
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
