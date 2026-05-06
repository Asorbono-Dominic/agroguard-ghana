import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analyse from './pages/Analyse';
import Results from './pages/Results';
import Methodology from './pages/Methodology';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyse" element={<Analyse />} />
        <Route path="/results" element={<Results />} />
        <Route path="/methodology" element={<Methodology />} />
      </Routes>
    </Router>
  );
}

export default App;