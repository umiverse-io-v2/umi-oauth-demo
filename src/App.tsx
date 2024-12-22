import Login from './Pages/Login';
import LoginSuccess from './Pages/LoginSuccess';
import Index from './Pages/Index';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import './App.css';
import { Game } from './Pages/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/" element={<Index />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
