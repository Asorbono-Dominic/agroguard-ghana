import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analyse from './pages/Analyse';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyse" element={<Analyse />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;