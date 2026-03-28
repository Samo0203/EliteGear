import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    region: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = register({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      mobile: formData.mobile,
      region: formData.region,
      gender: formData.gender,
      password: formData.password
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } else {
      setError(result.message || "Registration failed");
    }
    setLoading(false);
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-[var(--oat-milk)] flex items-center justify-center p-6">
        <div className="text-center bg-white p-12 rounded-3xl max-w-md shadow-xl border border-[var(--linen)]">
          <CheckCircle className="mx-auto text-[var(--leaf)]" size={80} />
          <h2 className="text-3xl font-bold mt-6 text-[var(--carbon)]">Account Created Successfully!</h2>
          <p className="text-[var(--linen)] mt-4">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--oat-milk)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <Dumbbell className="mx-auto text-[var(--leaf)]" size={64} />
          <h1 className="text-4xl font-bold mt-6 text-[var(--carbon)]">Join EliteGear</h1>
          <p className="text-[var(--linen)] mt-2">Create your account and start shopping</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-[var(--linen)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
<div>
  <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Full Name</label>
  <input 
    type="text" 
    name="name" 
    value={formData.name} 
    onChange={handleChange}
    className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
               text-[var(--carbon)] placeholder:text-[var(--linen)] 
               focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
    placeholder="Enter your full name"
    required 
  />
</div>

{/* Username */}
<div>
  <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Username</label>
  <input 
    type="text" 
    name="username" 
    value={formData.username} 
    onChange={handleChange}
    className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
               text-[var(--carbon)] placeholder:text-[var(--linen)] 
               focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
    placeholder="Choose a username"
    required 
  />
</div>

            {/* Email */}
            <div>
              <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
                           text-[var(--carbon)] placeholder:text-[var(--linen)] 
                           focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
                placeholder="your@email.com"
                required 
              />
            </div>

            {/* Mobile & Region Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleChange}
                  className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
                             text-[var(--carbon)] placeholder:text-[var(--linen)] 
                             focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
                  placeholder="07XXXXXXXX"
                  required 
                />
              </div>
              <div>
                <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Region</label>
                <select 
                  name="region" 
                  value={formData.region} 
                  onChange={handleChange}
                  className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
                             text-[var(--carbon)] focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
                  required
                >
                  <option value="">Select your region</option>
                  <option value="Western">Western</option>
                  <option value="Central">Central</option>
                  <option value="Southern">Southern</option>
                  <option value="Northern">Northern</option>
                  <option value="Eastern">Eastern</option>
                </select>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[var(--linen)] text-sm mb-3 font-medium">Gender</label>
              <div className="flex gap-8 text-[var(--carbon)]">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-[var(--leaf)] transition-colors">
                    <input 
                      type="radio" 
                      name="gender" 
                      value={g} 
                      checked={formData.gender === g}
                      onChange={handleChange} 
                      className="accent-[var(--leaf)] w-4 h-4" 
                    />
                    <span className="text-base">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
                             text-[var(--carbon)] placeholder:text-[var(--linen)] 
                             focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
                  placeholder="Create password"
                  required 
                />
              </div>
              <div>
                <label className="block text-[var(--linen)] text-sm mb-2 font-medium">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  className="w-full bg-white border border-[var(--linen)] rounded-2xl px-5 py-4 
                             text-[var(--carbon)] placeholder:text-[var(--linen)] 
                             focus:border-[var(--leaf)] focus:ring-1 focus:ring-[var(--leaf)] outline-none transition-all"
                  placeholder="Confirm password"
                  required 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl text-sm">
                <AlertCircle size={20} /> 
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--leaf)] hover:bg-[#5a6b52] py-4 rounded-2xl 
                         font-semibold text-lg text-white disabled:opacity-70 
                         transition-all duration-200 active:scale-[0.985]"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-[var(--linen)]">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[var(--leaf)] hover:underline font-medium transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}