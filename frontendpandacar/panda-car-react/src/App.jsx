import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import SignupForm from './Components/SignupForm/SignupForm';
import AdminDashbord from './Components/AdminDashbord/AdminDashbord';
import HomePage from './Components/HomePage/HomePage'; 
import CarsPage from './Components/CarsPage/CarsPage'; 

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/admin' element={<AdminDashbord />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/cars' element={<CarsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
