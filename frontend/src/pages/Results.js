import { useLocation, useNavigate } from 'react-router-dom';

const riskColors = {
  LOW: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', gauge: 'bg-green-500' },
  MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', gauge: 'bg-yellow-500' },
  HIGH: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', gauge: 'bg-red-500' },
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, form } = location.state || {};

  if (!result) {
    navigate('/analyse');
    return null;
  }

  const colors = riskColors[result.risk_level] || riskColors.LOW;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Risk score card */}
        <div className={`rounded-2xl border-2 p-8 text-center ${colors.bg} ${colors.border}`}>
          <p className="text-sm font-medium text-gray-600 mb-1">Crop Loss Risk for {form?.crop_type} in {form?.region}</p>
          <div className={`text-7xl font-black mb-2 ${colors.text}`}>{result.risk_score}%</div>
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
            {result.risk_level} RISK
          </span>
          {/* Risk bar */}
          <div className="mt-6 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className={`h-3 rounded-full ${colors.gauge} transition-all`}
              style={{ width: `${result.risk_score}%` }} />
          </div>
        </div>

        {/* Factors */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4">⚠️ Risk Factors Detected</h2>
          <ul className="space-y-2">
            {result.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-yellow-500 mt-1">●</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-4">✅ Recommended Actions</h2>
          <ul className="space-y-3">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-3 bg-green-50 rounded-lg p-3 text-sm text-gray-700">
                <span className="text-green-600 font-bold mt-0.5">{i + 1}.</span> {r}
              </li>
            ))}
          </ul>
        </div>

        {result.risk_level === 'HIGH' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
            🚨 <strong>High risk detected.</strong> {form?.phone_number
              ? 'An SMS alert has been sent to your phone number.'
              : 'Add your phone number to receive SMS alerts for high-risk predictions.'}
          </div>
        )}

        <button onClick={() => navigate('/analyse')}
          className="w-full bg-green-800 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
          ← Analyse Another Farm
        </button>
      </div>
    </div>
  );
}