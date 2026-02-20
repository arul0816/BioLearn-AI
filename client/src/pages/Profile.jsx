import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import authService from '../services/authService';
import { User, Mail, GraduationCap, Zap, Flame, Edit3, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const LEVELS = ['School', 'UG', 'PG'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', level: user?.level || 'UG' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await authService.updateProfile(form);
      updateUser(data.user);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const levelColors = { School: 'text-blue-400 bg-blue-500/20', UG: 'text-emerald-400 bg-emerald-500/20', PG: 'text-purple-400 bg-purple-500/20' };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white">
            <User className="inline w-7 h-7 text-emerald-400 mr-2" />
            Profile
          </h1>
          <p className="text-slate-400 mt-1">Manage your account and learning preferences</p>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-5 text-emerald-400 text-sm">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Avatar & basic info */}
        <div className="glass-card p-8 mb-5">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white shadow-xl shadow-emerald-500/30">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-2xl">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[user?.level]}`}>
                  {user?.level} Level
                </span>
                <span className="text-slate-500 text-sm capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* XP & Streak */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="font-display font-bold text-2xl text-amber-400">{user?.totalXp || 0}</div>
              <div className="text-slate-400 text-xs">Total XP</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="font-display font-bold text-2xl text-orange-400">{user?.streak || 0}</div>
              <div className="text-slate-400 text-xs">Day Streak</div>
            </div>
          </div>

          {/* Edit form */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Academic Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map(l => (
                    <button key={l} type="button" onClick={() => setForm(p => ({ ...p, level: l }))}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        form.level === l ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >{l}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); setForm({ name: user?.name, level: user?.level }); }} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-outline w-full flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        {/* Account details */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" /> Account Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-3 border-b border-white/5">
              <Mail className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-slate-400 text-xs">Email</div>
                <div className="text-white text-sm">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-white/5">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-slate-400 text-xs">Learning Level</div>
                <div className="text-white text-sm">{user?.level}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3">
              <User className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-slate-400 text-xs">Member Since</div>
                <div className="text-white text-sm">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;