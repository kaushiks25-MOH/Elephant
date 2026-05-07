import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/api';
import { TreePine, Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === 'HQ_OFFICER' || data.user.role === 'ADMIN') {
        navigate('/hq');
      } else {
        navigate('/field');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1549646450-48283cc72bb4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-sm"></div>
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-full shadow-lg border-2 border-forest-500 flex items-center justify-center w-24 h-24">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg" alt="Tamil Nadu Government Logo" className="h-16 w-auto" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white drop-shadow-md">
          Tamil Nadu Forest Department
        </h2>
        <p className="mt-2 text-center text-sm text-forest-200">
          Elephant Conflict Monitoring System
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-forest-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Officer ID / Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                  placeholder="e.g. field1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/register" className="text-sm text-forest-600 hover:text-forest-500 font-medium">
                Don't have an account? Register as New User
              </Link>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              <p>Demo accounts:</p>
              <p>field1 / password123</p>
              <p>hq1 / password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
