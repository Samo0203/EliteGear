import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      if (username.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); 
      }
    } else {
      setError(result.message || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--oat-milk)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Dumbbell className="mx-auto text-[var(--leaf)]" size={64} />
          <h1 className="text-4xl font-bold mt-6 text-[var(--carbon)]">Welcome Back</h1>
          <p className="text-[var(--linen)] mt-2">Sign in to continue to EliteGear</p>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-xl border border-[var(--linen)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--linen)] mb-2 text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-[var(--linen)] rounded-2xl px-6 py-4 focus:border-[var(--leaf)] outline-none text-[var(--carbon)]"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--linen)] mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[var(--linen)] rounded-2xl px-6 py-4 focus:border-[var(--leaf)] outline-none text-[var(--carbon)]"
                placeholder="Password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl text-sm">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--leaf)] hover:bg-[#5a6b52] py-4 rounded-2xl font-semibold text-lg text-white disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-8 text-[var(--linen)]">
            Don't have an account?{' '}
            <Link to="/Register" className="text-[var(--leaf)] hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}