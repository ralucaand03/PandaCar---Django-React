import './App.css'
import LoginForm from './Components/LoginForm/LoginForm'
import SignupForm from './Components/SignupForm/SignupForm'

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return(
   
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm/>} />
        <Route path='/signup' element={<SignupForm/>} />
      </Routes>
    </Router>

  )
}

export default App
