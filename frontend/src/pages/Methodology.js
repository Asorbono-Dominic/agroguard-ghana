export default function Methodology() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="text-center">
          <div className="text-5xl mb-3">🔬</div>
          <h1 className="text-3xl font-bold text-gray-800">How AgroGuard Works</h1>
          <p className="text-gray-500 mt-2">Transparency in AI — understanding our methodology</p>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Data Sources</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 mt-1">Real</span>
              <div>
                <p className="font-medium text-gray-800">FAO GAEZ — Ghana Crop Production Data</p>
                <p className="text-sm text-gray-500">Official yield, area harvested, and production figures for 6 Ghanaian crops (2010–2023). Used to derive real crop loss risk labels based on yield drops vs historical averages.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 mt-1">Real</span>
              <div>
                <p className="font-medium text-gray-800">Open-Meteo Weather API</p>
                <p className="text-sm text-gray-500">Free, open-source weather API providing real-time 7-day forecasts for Ghana regions. Fetches temperature, precipitation, and humidity at prediction time.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 mt-1">Synthetic</span>
              <div>
                <p className="font-medium text-gray-800">Farmer-level simulation data</p>
                <p className="text-sm text-gray-500">1,500 synthetic farmer records generated using realistic Ghana agricultural parameters, with risk labels anchored to real FAO yield data. This augmentation is necessary due to the absence of publicly available farmer-level crop loss records in Ghana.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Model */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 Machine Learning Model</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Model', value: 'XGBoost' },
              { label: 'Accuracy', value: '92%' },
              { label: 'F1 Score', value: '0.89' },
              { label: 'CV Folds', value: '5-fold' },
            ].map((stat, i) => (
              <div key={i} className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-800">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            We use XGBoost (Extreme Gradient Boosting) because it handles mixed tabular data well,
            performs strongly on small datasets, provides built-in feature importance, and requires
            no deep learning infrastructure. The model was trained using a scikit-learn Pipeline
            with 5-fold cross-validation to prevent overfitting.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Model Input Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Region', source: 'User input', desc: 'Ghana administrative region' },
              { name: 'Crop type', source: 'User input', desc: 'One of 6 supported crops' },
              { name: 'Planting month', source: 'User input', desc: 'Month of planting (1–12)' },
              { name: 'Days since planting', source: 'User input', desc: 'Growth stage proxy' },
              { name: 'Soil pH', source: 'User input', desc: 'Optional soil acidity measure' },
              { name: 'Temperature max', source: 'Open-Meteo', desc: '7-day forecast high temp' },
              { name: 'Temperature min', source: 'Open-Meteo', desc: '7-day forecast low temp' },
              { name: 'Precipitation 7-day', source: 'Open-Meteo', desc: 'Total rainfall forecast' },
              { name: 'Humidity', source: 'Open-Meteo', desc: 'Max relative humidity' },
              { name: 'Yield drop %', source: 'FAO data', desc: 'Historical yield deviation' },
            ].map((f, i) => (
              <div key={i} className="flex justify-between items-start bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
                  f.source === 'User input' ? 'bg-blue-100 text-blue-700' :
                  f.source === 'Open-Meteo' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{f.source}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">⚠️ Limitations & Honest Disclosures</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span>•</span> Farmer-level training data is synthetic due to lack of public Ghanaian farm records. Risk labels are anchored to real FAO yield data but individual predictions should be treated as indicative.</li>
            <li className="flex gap-2"><span>•</span> The model does not account for pest or disease outbreaks, which can cause sudden crop loss independent of weather.</li>
            <li className="flex gap-2"><span>•</span> Regional weather data is fetched at the region centroid — microclimatic variations within regions are not captured.</li>
            <li className="flex gap-2"><span>•</span> This tool is a decision support system. Farmers should combine AI recommendations with local expertise and extension officer advice.</li>
          </ul>
        </div>

        {/* Stack */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🛠️ Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { layer: 'Frontend', tech: 'React + Tailwind CSS' },
              { layer: 'Backend', tech: 'FastAPI (Python)' },
              { layer: 'ML Model', tech: 'XGBoost + scikit-learn' },
              { layer: 'Weather', tech: 'Open-Meteo API' },
              { layer: 'SMS Alerts', tech: "Africa's Talking" },
              { layer: 'Training Data', tech: 'FAO GAEZ Ghana' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{s.layer}</p>
                <p className="text-sm font-semibold text-gray-800">{s.tech}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}