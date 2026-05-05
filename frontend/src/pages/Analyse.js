import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictCropLoss } from '../services/api';

const REGIONS = [
  'Ashanti', 'Brong-Ahafo', 'Central', 'Eastern',
  'Greater Accra', 'Northern', 'Upper East', 'Upper West', 'Volta', 'Western'
];

const CROPS = ['maize', 'cassava', 'yam', 'groundnut', 'rice', 'cocoa', 'tomato'];

export default function Analyse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    region: '',
    crop_type: '',
    planting_month: '',
    days_since_planting: '',
    soil_ph: '6.0',
    phone_number: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        region: form.region,
        crop_type: form.crop_type,
        planting_month: parseInt(form.planting_month),
        days_since_planting: parseInt(form.days_since_planting),
        soil_ph: parseFloat(form.soil_ph),
        phone_number: form.phone_number || null,
      };
      const result = await predictCropLoss(payload);
      navigate('/results', { state: { result, form } });
    } catch (err) {
      setError('Failed to get prediction. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌱</div>
          <h1 className="text-3xl font-bold text-gray-800">Analyse Your Farm Risk</h1>
          <p className="text-gray-500 mt-2">Fill in your farm details to get an AI-powered risk assessment.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
            <select name="region" value={form.region} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select region</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type *</label>
            <select name="crop_type" value={form.crop_type} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select crop</option>
              {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planting Month *</label>
              <input type="number" name="planting_month" value={form.planting_month} onChange={handleChange}
                min="1" max="12" placeholder="e.g. 4" required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Since Planting *</label>
              <input type="number" name="days_since_planting" value={form.days_since_planting} onChange={handleChange}
                min="1" max="180" placeholder="e.g. 30" required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soil pH (optional)</label>
            <input type="number" name="soil_ph" value={form.soil_ph} onChange={handleChange}
              min="4" max="8" step="0.1" placeholder="e.g. 6.0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (optional — for SMS alert)</label>
            <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange}
              placeholder="+233241234567"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-green-800 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Analysing...' : 'Analyse My Risk →'}
          </button>
        </form>
      </div>
    </div>
  );
}