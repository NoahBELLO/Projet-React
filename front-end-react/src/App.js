import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Dashboard from './components/Dashboard';
import Home from "./components/Home";

function App() {
  return (
    <div className="AppPrincipal">
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
