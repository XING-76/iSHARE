import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
// Components
import Home from './components/Home';
import Sign from './components/Sign';
// Service
import AuthService from './services/auth.service';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/sign');
  }, []);

  return (
    <Routes>
      <Route path="sign" element={<Sign currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
      <Route path="/*" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
    </Routes>
  );
}

export default App;
