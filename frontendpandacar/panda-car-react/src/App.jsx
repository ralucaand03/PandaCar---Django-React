import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import SignupForm from './Components/SignupForm/SignupForm';
import AdminDashbord from './Components/AdminDashbord/AdminDashbord';
import HomePage from './Components/HomePage/HomePage'; 
import CarsPage from './Components/CarsPage/CarsPage'; 
import Favorites from './Components/Favorites/Favorites'; 
import Account from './Components/Account/Account'; 
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
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/account' element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
