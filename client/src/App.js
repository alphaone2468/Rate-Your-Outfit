import logo from './logo.svg';
import './App.css';
import LandingPage from './components/LandingPage';
import { Route,Routes } from 'react-router-dom';
import Login from './components/Login';
import Content from './components/Content';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/content' element={<Content/>}/>
    </Routes>

    </>
  );
}

export default App;
