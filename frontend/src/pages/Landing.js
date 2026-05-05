import { Link } from 'react-router-dom';

const steps = [
  { icon: '📋', title: 'Enter your farm details', desc: 'Tell us your region, crop type, and planting date.' },
  { icon: '🌦️', title: 'We fetch live weather data', desc: 'Real-time weather for your region from Open-Meteo.' },
  { icon: '🤖', title: 'AI analyses your risk', desc: 'Our XGBoost model trained on Ghana FAO data predicts your crop loss risk.' },
  { icon: '📱', title: 'Get recommendations + SMS', desc: 'Receive actionable advice and an SMS alert if risk is high.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-green-800 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Protect Your Harvest with AI
          </h1>
          <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
            AgroGuard Ghana uses artificial intelligence and real weather data
            to predict crop loss risks for Ghanaian farmers — before it's too late.
          </p>
          <Link
            to="/analyse"
            className="bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 transition inline-block"
          >
            Analyse My Farm Risk →
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Focus areas */}
      <div className="bg-green-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crops We Cover</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Maize', 'Cassava', 'Yam', 'Groundnut', 'Rice', 'Cocoa', 'Tomato'].map(crop => (
              <span key={crop} className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
                {crop}
              </span>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/analyse"
              className="bg-green-800 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-green-700 transition inline-block"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}