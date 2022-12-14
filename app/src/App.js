import { BrowserRouter as Router, 
                          Routes, 
                          Route } from 'react-router-dom';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
