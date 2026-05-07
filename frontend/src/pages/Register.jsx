import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('FIELD_STAFF');
  const [rangeDivision, setRangeDivision] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(email, password, name, role, rangeDivision);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-forest-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your account has been created.</p>
          <p className="text-sm text-forest-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-forest-400 via-forest-900 to-black"></div>
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-full shadow-lg border-2 border-forest-500 flex items-center justify-center w-20 h-20">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg" alt="Tamil Nadu Government Logo" className="h-12 w-auto" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white drop-shadow-md">
          TN Forest Department
        </h2>
        <p className="mt-2 text-center text-sm text-forest-200">
          Create a new officer account
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-forest-100">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forest-500 focus:border-forest-500" placeholder="Officer Name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forest-500 focus:border-forest-500" placeholder="officer@forest.gov.in" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forest-500 focus:border-forest-500" placeholder="Minimum 6 characters" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forest-500 focus:border-forest-500">
                <option value="FIELD_STAFF">Field Staff (Mobile App)</option>
                <option value="HQ_OFFICER">HQ Officer (Dashboard)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Range / Division</label>
              <input type="text" required value={rangeDivision} onChange={e => setRangeDivision(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forest-500 focus:border-forest-500" placeholder="e.g., North Division" />
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 disabled:opacity-50 transition-colors">
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-forest-600 hover:text-forest-500 font-medium">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
