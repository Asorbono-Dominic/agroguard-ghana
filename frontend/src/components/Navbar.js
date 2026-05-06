import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌾</span>
        <span className="text-xl font-bold tracking-tight">AgroGuard Ghana</span>
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/" className={`hover:text-green-300 transition ${location.pathname === '/' ? 'text-green-300' : ''}`}>
          Home
        </Link>
        <Link to="/analyse" className={`hover:text-green-300 transition ${location.pathname === '/analyse' ? 'text-green-300' : ''}`}>
          Analyse Risk
        </Link>
        <Link to="/methodology" className={`hover:text-green-300 transition ${location.pathname === '/methodology' ? 'text-green-300' : ''}`}>
          Methodology
        </Link>
      </div>
    </nav>
  );
}