import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserProfile, FinancialProfile } from '../types';
import { Modal } from '../components/common/Modal';
import {
  User,
  IndianRupee,
  Shield,
  Download,
  Trash2,
  Save,
  Check,
  Palette
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { logout, updateUserContext } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [finProfile, setFinProfile] = useState<FinancialProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Delete account modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [p, fp] = await Promise.all([
          api.getProfile(),
          api.getFinancialProfile(),
        ]);
        setProfile(p);
        setFinProfile(fp);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !finProfile) return;

    try {
      setSaving(true);
      await Promise.all([
        api.updateProfile(profile),
        api.updateFinancialProfile(finProfile),
      ]);
      updateUserContext({ displayName: profile.displayName });
      setSuccessMsg('Settings saved successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await api.exportUserData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', 'finpath_user_data.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Error exporting user data:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await api.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !profile || !finProfile) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#C74634] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#79675E]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5D8CB]">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#49362E]">Settings & Preferences</h1>
          <p className="text-sm text-[#79675E] mt-1">
            Manage your personal details, financial baseline numbers, data privacy, and exports.
          </p>
        </div>

        {successMsg && (
          <span className="text-xs font-semibold text-[#356B4B] bg-[#DCE8DE] px-3 py-1.5 rounded-full flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> {successMsg}
          </span>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Profile Details */}
        <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-8 border border-[#E5D8CB] shadow-soft space-y-4">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <User className="w-5 h-5 text-[#C74634]" />
            Personal Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profile.displayName || ''}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Age Range
              </label>
              <select
                value={profile.ageRange || '25-34'}
                onChange={(e) => setProfile({ ...profile, ageRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              >
                <option value="18-24">18 - 24</option>
                <option value="25-34">25 - 34</option>
                <option value="35-44">35 - 44</option>
                <option value="45+">45+</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Country
              </label>
              <input
                type="text"
                value={profile.country || ''}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Available Hours / Week
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={profile.availableHoursPerWeek || 10}
                onChange={(e) => setProfile({ ...profile, availableHoursPerWeek: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Skills & Capabilities
              </label>
              <input
                type="text"
                value={profile.skills || ''}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
          </div>
        </div>

        {/* Financial Baseline Numbers */}
        <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-8 border border-[#E5D8CB] shadow-soft space-y-4">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#C74634]" />
            Financial Baseline Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Monthly Take-Home Income (₹)
              </label>
              <input
                type="number"
                min="0"
                value={finProfile.monthlyTakeHomeIncome || 0}
                onChange={(e) => setFinProfile({ ...finProfile, monthlyTakeHomeIncome: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Monthly Essential Expenses (₹)
              </label>
              <input
                type="number"
                min="0"
                value={finProfile.monthlyEssentialExpenses || 0}
                onChange={(e) => setFinProfile({ ...finProfile, monthlyEssentialExpenses: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Monthly Discretionary Expenses (₹)
              </label>
              <input
                type="number"
                min="0"
                value={finProfile.monthlyDiscretionaryExpenses || 0}
                onChange={(e) => setFinProfile({ ...finProfile, monthlyDiscretionaryExpenses: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49362E] uppercase tracking-wider mb-1">
                Current Savings Reserve (₹)
              </label>
              <input
                type="number"
                min="0"
                value={finProfile.currentSavings || 0}
                onChange={(e) => setFinProfile({ ...finProfile, currentSavings: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D8CB] bg-white text-xs text-[#49362E]"
              />
            </div>
          </div>
        </div>

        {/* Brand Theme Preference */}
        <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-8 border border-[#E5D8CB] shadow-soft space-y-3">
          <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#C74634]" />
            Appearance & Brand Theme
          </h2>
          <p className="text-xs text-[#79675E]">
            FinPath defaults to the signature Terracotta-Red & Warm-Cream palette designed for a warm, human, and professional fintech feel.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4E2D9] border border-[#D9A28F] text-xs font-bold text-[#9E3529]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#C74634]" />
              Signature Terracotta Warm (Active)
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-[#C74634] hover:bg-[#9E3529] shadow-xs"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Privacy, Export, and Delete Section */}
      <div className="pt-6 border-t border-[#E5D8CB] space-y-4">
        <h2 className="font-display text-xl font-bold text-[#49362E] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#356B4B]" />
          Data Ownership & Privacy
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#FFF9F1] border border-[#E5D8CB] gap-3">
          <div>
            <div className="text-xs font-bold text-[#49362E]">Export All Personal Records</div>
            <div className="text-[11px] text-[#79675E]">Download your complete financial profile, transactions, and roadmaps in JSON format.</div>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs text-[#49362E] bg-white border border-[#E5D8CB] hover:bg-[#F4E2D9]"
          >
            <Download className="w-3.5 h-3.5 text-[#79675E]" /> Export Data
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#FFF9F1] border border-[#C74634]/30 gap-3">
          <div>
            <div className="text-xs font-bold text-[#9E3529]">Permanently Delete Account</div>
            <div className="text-[11px] text-[#79675E]">Erase all your goals, transaction history, profile data, and validation notes.</div>
          </div>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs text-white bg-[#9E3529] hover:bg-[#C74634]"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Permanently Delete Account?"
        maxWidth="sm"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#79675E] leading-relaxed">
            This action cannot be undone. All your saved financial goals, roadmaps, customer interviews, and transactions will be immediately purged.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#79675E]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 rounded-full font-semibold text-xs text-white bg-[#9E3529]"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
