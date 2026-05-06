import { useLocation, useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const riskColors = {
  LOW: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', gauge: 'bg-green-500', hex: '#16a34a' },
  MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', gauge: 'bg-yellow-500', hex: '#ca8a04' },
  HIGH: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', gauge: 'bg-red-500', hex: '#dc2626' },
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
  const chartData = [{ name: 'Risk', value: result.risk_score, fill: colors.hex }];

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6" id="results-content">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Risk Assessment Report</h1>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            🖨️ Save as PDF
          </button>
        </div>

        {/* Risk score card with radial chart */}
        <div className={`rounded-2xl border-2 p-8 ${colors.bg} ${colors.border}`}>
          <p className="text-sm font-medium text-gray-600 text-center mb-2">
            Crop Loss Risk for <strong>{form?.crop_type}</strong> in <strong>{form?.region}</strong>
          </p>
          <div className="flex items-center justify-center gap-8">
            {/* Radial gauge */}
            <div className="w-40 h-40 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="70%" outerRadius="100%"
                  barSize={12}
                  data={chartData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: '#e5e7eb' }}
                    dataKey="value"
                    angleAxisId={0}
                    data={chartData}
                    cornerRadius={6}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${colors.text}`}>{result.risk_score}%</span>
              </div>
            </div>
            {/* Risk details */}
            <div>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${colors.bg} ${colors.text} ${colors.border} mb-3`}>
                {result.risk_level} RISK
              </span>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📍 Region: <strong>{form?.region}</strong></p>
                <p>🌱 Crop: <strong>{form?.crop_type}</strong></p>
                <p>📅 Planting month: <strong>{form?.planting_month}</strong></p>
                <p>⏱️ Days since planting: <strong>{form?.days_since_planting}</strong></p>
              </div>
            </div>
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

        {/* SMS alert notice */}
        {result.risk_level === 'HIGH' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
            🚨 <strong>High risk detected.</strong> {form?.phone_number
              ? 'An SMS alert has been sent to your phone number.'
              : 'Add your phone number on the form to receive SMS alerts for high-risk predictions.'}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500">
          <strong>Disclaimer:</strong> This report is generated by an AI model trained on FAO Ghana data and real-time weather.
          It is a decision support tool — please combine with local agricultural expertise.
          Generated: {new Date().toLocaleDateString('en-GH', { dateStyle: 'full' })}
        </div>

        <button
          onClick={() => navigate('/analyse')}
          className="w-full bg-green-800 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
        >
          ← Analyse Another Farm
        </button>
      </div>
    </div>
  );
}