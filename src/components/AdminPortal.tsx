import React, { useState, useRef } from 'react';
import { Profile, Payment, PremiumRequest } from '../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  IndianRupee,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Check,
  X,
  Camera,
  Image as ImageIcon,
  QrCode,
  Banknote,
  Gift,
  ExternalLink,
  Copy,
  BookOpen,
  FileText,
  UserCheck
} from 'lucide-react';

interface Props {
  profiles: Profile[];
  payments: Payment[];
  premiumRequests: PremiumRequest[];
  onSaveProfile: (profile: Partial<Profile>, paymentAmount?: number, paymentMethod?: string) => Promise<void>;
  onDeleteProfile: (id: string) => Promise<void>;
  onApproveProfile: (id: string) => Promise<void>;
  onRejectProfile: (id: string) => Promise<void>;
  onApprovePremiumRequest: (id: string) => Promise<void>;
  onRejectPremiumRequest: (id: string) => Promise<void>;
  onDeactivatePremium?: (profileIdOrPhone: string) => Promise<void>;
  onExitAdmin: () => void;
  adminEmail: string;
}

type TabType =
  | 'dashboard'
  | 'biodata_directory'
  | 'user_accounts'
  | 'premium_requests'
  | 'profiles'
  | 'requests'
  | 'add'
  | 'payments'
  | 'premium'
  | 'reports';

export const AdminPortal: React.FC<Props> = ({
  profiles,
  payments,
  premiumRequests = [],
  onSaveProfile,
  onDeleteProfile,
  onApproveProfile,
  onRejectProfile,
  onApprovePremiumRequest,
  onRejectPremiumRequest,
  onDeactivatePremium,
  onExitAdmin,
  adminEmail,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regFilter, setRegFilter] = useState('');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);
  const [premiumTabFilter, setPremiumTabFilter] = useState<'ALL' | 'PENDING' | 'UPI_QR' | 'CASH_OFFICE' | 'FREE_REQUEST'>('ALL');
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Profile> & { amount?: number; pay_method?: string; pay_status?: string }>({
    full_name: '',
    email: '',
    mobile: '',
    guardian_name: '',
    guardian_relation: 'Father (Guardian)',
    guardian_mobile: '',
    gender: 'Male',
    date_of_birth: '1995-01-01',
    location: '',
    education: '',
    profession: '',
    marital_status: 'Never Married',
    registration_type: 'CASH_ADMIN',
    profile_status: 'APPROVED',
    is_verified: true,
    is_premium: false,
    premium_plan: '1 Month',
    premium_start: new Date().toISOString().slice(0, 10),
    premium_end: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    profile_photo: '',
    about: '',
    amount: 1999,
    pay_method: 'CASH',
    pay_status: 'PAID'
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Please choose an image file under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, profile_photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered Profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      [p.full_name, p.mobile, p.guardian_mobile, p.email, p.location, p.education, p.profession]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || p.profile_status === statusFilter;
    const matchesReg = !regFilter || p.registration_type === regFilter;
    return matchesSearch && matchesStatus && matchesReg;
  });

  const pendingRequests = profiles.filter((p) => p.profile_status === 'PENDING');
  const pendingPremiumRequests = premiumRequests.filter((r) => r.status === 'PENDING');
  const upiRequests = premiumRequests.filter((r) => r.plan_type === 'UPI_QR');
  const cashRequests = premiumRequests.filter((r) => r.plan_type === 'CASH_OFFICE');
  const freeRequests = premiumRequests.filter((r) => r.plan_type === 'FREE_REQUEST');

  const filteredPremiumRequests = premiumRequests.filter((r) => {
    if (premiumTabFilter === 'PENDING') return r.status === 'PENDING';
    if (premiumTabFilter === 'UPI_QR') return r.plan_type === 'UPI_QR';
    if (premiumTabFilter === 'CASH_OFFICE') return r.plan_type === 'CASH_OFFICE';
    if (premiumTabFilter === 'FREE_REQUEST') return r.plan_type === 'FREE_REQUEST';
    return true;
  });

  // Metrics
  const totalProfilesCount = profiles.length;
  const activePremiumCount = profiles.filter(
    (p) => p.is_premium && (!p.premium_end || p.premium_end >= todayStr)
  ).length;
  const cashPaymentsCount = payments.filter((p) => p.payment_method === 'CASH').length;
  const totalRevenue = payments
    .filter((p) => p.payment_status === 'PAID')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const handleEditClick = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      ...profile,
      amount: 0,
      pay_method: 'CASH',
      pay_status: 'PAID'
    });
    setActiveTab('add');
  };

  const handleCreateNewClick = () => {
    setEditingProfile(null);
    setFormData({
      full_name: '',
      email: '',
      mobile: '',
      guardian_name: '',
      guardian_relation: 'Father (Guardian)',
      guardian_mobile: '',
      gender: 'Male',
      date_of_birth: '1995-01-01',
      location: '',
      education: '',
      profession: '',
      marital_status: 'Never Married',
      registration_type: 'CASH_ADMIN',
      profile_status: 'APPROVED',
      is_verified: true,
      is_premium: false,
      premium_plan: '1 Month',
      premium_start: todayStr,
      premium_end: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      profile_photo: '',
      about: '',
      amount: 1999,
      pay_method: 'CASH',
      pay_status: 'PAID'
    });
    setActiveTab('add');
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProfile(
      {
        ...formData,
        id: editingProfile?.id,
      },
      formData.amount,
      formData.pay_method
    );
    alert(editingProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
    setEditingProfile(null);
    setActiveTab('profiles');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-900 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 p-4 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
            <img
              src="/assets/aistudio/LOGO-01_fe7effc7.png"
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-sm"
            />
            <div>
              <h1 className="font-serif font-bold text-lg text-[#4b001f] leading-none">
                Nikah Circle
              </h1>
              <span className="text-[11px] font-bold text-[#c9973e] uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* NEW: Full Biodata Directory */}
            <button
              onClick={() => setActiveTab('biodata_directory')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'biodata_directory'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#c9973e]" />
                <span>Full Biodata Directory</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-100 text-stone-700 font-bold">
                {profiles.length}
              </span>
            </button>

            {/* NEW: User Registered Accounts */}
            <button
              onClick={() => setActiveTab('user_accounts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'user_accounts'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>User Accounts</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                {profiles.filter((p) => p.registration_type === 'ONLINE').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('premium_requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'premium_requests'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#c9973e]" />
                <span>Premium Requests</span>
              </div>
              {pendingPremiumRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#c9973e] text-[#350016] font-bold">
                  {pendingPremiumRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'requests'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Profile Approvals</span>
              </div>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-900 font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'profiles'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Manage Profiles ({totalProfilesCount})</span>
            </button>

            <button
              onClick={handleCreateNewClick}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'add'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'payments'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              <span>Payments Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('premium')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'premium'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Premium Users ({activePremiumCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                activeTab === 'reports'
                  ? 'bg-[#4b001f] text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Reports</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-stone-200 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-stone-50 text-[11px] text-stone-600">
            <span className="block font-bold text-stone-900 truncate">nikahcircle01@gmail.com</span>
            <span className="text-emerald-700 font-semibold">Super Admin Authenticated</span>
          </div>

          <button
            onClick={onExitAdmin}
            className="w-full py-2 px-3 rounded-xl border border-[#4b001f] text-[#4b001f] hover:bg-[#fff6fa] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Public Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#4b001f]">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'biodata_directory' && 'Full Biodata Directory'}
              {activeTab === 'user_accounts' && 'User Accounts & Registrations'}
              {activeTab === 'premium_requests' && 'Premium & Payment Requests'}
              {activeTab === 'requests' && 'Pending Profile Approvals'}
              {activeTab === 'profiles' && 'Profile Management'}
              {activeTab === 'add' && (editingProfile ? 'Edit Profile' : 'Add Profile')}
              {activeTab === 'payments' && 'Payment Records'}
              {activeTab === 'premium' && 'Premium Members'}
              {activeTab === 'reports' && 'Reports'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review registrations, approve requests, and manage candidate biodata.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNewClick}
              className="px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Profile</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Total Profiles</span>
                <div className="font-serif text-3xl font-bold text-[#4b001f] mt-1 tabular-nums">
                  {totalProfilesCount}
                </div>
              </div>

              <div
                onClick={() => setActiveTab('premium_requests')}
                className="p-4 rounded-2xl bg-white border border-[#c9973e] shadow-xs cursor-pointer hover:bg-[#fffbf0] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#946b17]">Premium Requests</span>
                  {pendingPremiumRequests.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#c9973e] text-[#350016] font-bold">
                      {pendingPremiumRequests.length} Pending
                    </span>
                  )}
                </div>
                <div className="font-serif text-3xl font-bold text-[#c9973e] mt-1 tabular-nums">
                  {pendingPremiumRequests.length}
                </div>
              </div>

              <div
                onClick={() => setActiveTab('requests')}
                className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs cursor-pointer hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800">Profile Approvals</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                    Action
                  </span>
                </div>
                <div className="font-serif text-3xl font-bold text-amber-700 mt-1 tabular-nums">
                  {pendingRequests.length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Active Premium</span>
                <div className="font-serif text-3xl font-bold text-[#c9973e] mt-1 tabular-nums">
                  {activePremiumCount}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Total Revenue</span>
                <div className="font-serif text-3xl font-bold text-emerald-700 mt-1 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Pending Premium Requests Alert Banner */}
            {pendingPremiumRequests.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4b001f] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#c9973e]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#4b001f] text-sm">
                      {pendingPremiumRequests.length} new premium / payment requests pending verification!
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Review and approve or reject UPI scanner payments, cash counter, and free premium requests.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('premium_requests')}
                  className="px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Review Requests
                </button>
              </div>
            )}

            {/* Pending Requests Alert Banner */}
            {pendingRequests.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">
                      {pendingRequests.length} new profile requests awaiting verification!
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Click the Profile Approvals tab to review and approve.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Review
                </button>
              </div>
            )}

            {/* Recent Profiles */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#4b001f]">
                  Recent Profiles
                </h3>
                <button
                  onClick={() => setActiveTab('profiles')}
                  className="text-xs font-semibold text-[#4b001f] hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Guardian Mobile</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {profiles.slice(0, 6).map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-stone-900">
                          {p.full_name} ({p.gender})
                          <span className="block text-[11px] text-stone-400 font-normal">
                            {p.location || 'Kerala'}
                          </span>
                        </td>
                        <td className="p-3 text-stone-700">
                          {p.guardian_mobile ? (
                            <span className="font-semibold text-emerald-800">
                              {p.guardian_mobile} ({p.guardian_relation || 'Guardian'})
                            </span>
                          ) : (
                            <span className="text-stone-400">{p.mobile || '-'}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              p.profile_status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : p.profile_status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {p.profile_status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileToDelete(p)}
                              title="Delete Profile"
                              className="p-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FULL BIODATA DIRECTORY */}
        {activeTab === 'biodata_directory' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4b001f] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#c9973e]" />
                  <span>Full Biodata Directory</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Complete biodata of all registered profiles in chronological order. Total: {profiles.length} profiles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, place, phone, job..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none w-56 sm:w-64"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Biodata Cards / Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fff6fa] text-[#4b001f] border-b border-stone-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Candidate / Name</th>
                      <th className="p-3.5">Age & Gender</th>
                      <th className="p-3.5">Place & District</th>
                      <th className="p-3.5">Profession & Education</th>
                      <th className="p-3.5">Guardian Contact</th>
                      <th className="p-3.5">Contact (Candidate)</th>
                      <th className="p-3.5">Plan / Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-stone-500">
                          No profiles found.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                                {p.profile_photo ? (
                                  <img src={p.profile_photo} alt={p.full_name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-[#4b001f] text-xs">
                                    {(p.full_name || 'C').charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-stone-900 block">{p.full_name}</span>
                                <span className="text-[10px] text-stone-400">ID: {p.id.slice(0, 8)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-stone-700">
                            <div>{p.gender}</div>
                            <div className="text-[11px] text-stone-500">
                              {p.date_of_birth ? `${p.date_of_birth} (${p.age || Math.max(18, new Date().getFullYear() - new Date(p.date_of_birth).getFullYear())} yrs)` : (p.age ? `${p.age} yrs` : '-')}
                            </div>
                          </td>
                          <td className="p-3.5 text-stone-700">
                            <div className="font-medium">{p.place || p.location || '-'}</div>
                            <div className="text-[11px] text-stone-500">{p.district || p.state || 'Kerala'}</div>
                          </td>
                          <td className="p-3.5 text-stone-700">
                            <div className="font-medium text-stone-900">{p.profession || '-'}</div>
                            <div className="text-[11px] text-stone-500">{p.education || '-'}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-emerald-800">{p.guardian_mobile || '-'}</div>
                            <div className="text-[11px] text-stone-500">{p.guardian_name || 'Guardian'} ({p.guardian_relation || 'Parent'})</div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-stone-800">{p.mobile || '-'}</div>
                            <div className="text-[11px] text-stone-400 truncate max-w-[120px]">{p.email || '-'}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-col gap-1">
                              {p.is_premium ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 w-fit">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                  <span>Premium</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 w-fit">
                                  Free
                                </span>
                              )}
                              <span className={`text-[10px] font-semibold ${p.profile_status === 'APPROVED' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {p.profile_status}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingProfile(p)}
                                title="View Full Biodata"
                                className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-[#fff6fa] hover:text-[#4b001f] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleEditClick(p)}
                                title="Edit Biodata"
                                className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: USER ACCOUNTS */}
        {activeTab === 'user_accounts' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4b001f] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>User Created Accounts</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Accounts and biodata of users who registered directly from the app. Total: {profiles.filter((p) => p.registration_type === 'ONLINE').length} users.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fff6fa] text-[#4b001f] border-b border-stone-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">User Details</th>
                      <th className="p-3.5">Contact & Place</th>
                      <th className="p-3.5">Guardian Contact</th>
                      <th className="p-3.5">Hobbies & Interests</th>
                      <th className="p-3.5">Plan Status</th>
                      <th className="p-3.5">Profile Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {profiles.filter((p) => p.registration_type === 'ONLINE').length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-500">
                          No online user registrations yet.
                        </td>
                      </tr>
                    ) : (
                      profiles
                        .filter((p) => p.registration_type === 'ONLINE')
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                                  {p.profile_photo ? (
                                    <img src={p.profile_photo} alt={p.full_name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-[#4b001f] text-xs">
                                      {(p.full_name || 'U').charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-bold text-stone-900 block">{p.full_name}</span>
                                  <span className="text-[11px] text-stone-500">{p.gender} · {p.age || 25} yrs</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-stone-800">{p.mobile || '-'}</div>
                              <div className="text-[11px] text-stone-500">{p.place || p.district || 'Kerala'}</div>
                              <div className="text-[10px] text-stone-400">{p.email}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-emerald-800">{p.guardian_mobile || '-'}</div>
                              <div className="text-[11px] text-stone-500">{p.guardian_name || 'Guardian'}</div>
                            </td>
                            <td className="p-3.5 max-w-[180px]">
                              <div className="text-[11px] text-stone-700 truncate font-medium">
                                {Array.isArray(p.hobbies) ? p.hobbies.join(', ') : (p.hobbies || '-')}
                              </div>
                              <div className="text-[10px] text-stone-500 truncate">
                                {Array.isArray(p.interests) ? p.interests.join(', ') : (p.interests || '-')}
                              </div>
                            </td>
                            <td className="p-3.5">
                              {p.is_premium ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  ★ Premium
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                  Free Plan
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.profile_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {p.profile_status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {p.profile_status === 'PENDING' && (
                                  <button
                                    onClick={() => onApproveProfile(p.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                )}
                                <button
                                  onClick={() => setViewingProfile(p)}
                                  className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer"
                                  title="View Full Biodata"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PREMIUM & PAYMENT REQUESTS */}
        {activeTab === 'premium_requests' && (
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                  Premium & Payment Requests
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Review UPI scanner payments, cash counter receipts, and free premium requests to approve or reject.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#c9973e]/20 text-[#946b17] text-xs font-bold">
                  {pendingPremiumRequests.length} Pending Actions
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPremiumTabFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  premiumTabFilter === 'ALL'
                    ? 'bg-[#4b001f] text-white border-[#4b001f]'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                All ({premiumRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setPremiumTabFilter('PENDING')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  premiumTabFilter === 'PENDING'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                }`}
              >
                ⏳ Action Needed ({pendingPremiumRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setPremiumTabFilter('UPI_QR')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  premiumTabFilter === 'UPI_QR'
                    ? 'bg-[#4b001f] text-white border-[#4b001f]'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-[#c9973e]" />
                <span>UPI QR Payments ({upiRequests.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setPremiumTabFilter('CASH_OFFICE')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  premiumTabFilter === 'CASH_OFFICE'
                    ? 'bg-[#4b001f] text-white border-[#4b001f]'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash / Direct Counter ({cashRequests.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setPremiumTabFilter('FREE_REQUEST')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  premiumTabFilter === 'FREE_REQUEST'
                    ? 'bg-[#4b001f] text-white border-[#4b001f]'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-[#c9973e]" />
                <span>Premium Free (Girls & Other) ({freeRequests.length})</span>
              </button>
            </div>

            {/* List of Requests */}
            {filteredPremiumRequests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-700 text-base">No requests in this category!</h4>
                <p className="text-xs text-stone-500">New payments will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPremiumRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl bg-white border shadow-xs space-y-4 transition-all ${
                      req.status === 'PENDING'
                        ? 'border-amber-300 ring-1 ring-amber-300/40'
                        : req.status === 'APPROVED'
                        ? 'border-emerald-200'
                        : 'border-stone-200 opacity-75'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-lg text-[#4b001f]">
                            {req.user_name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.plan_type === 'UPI_QR'
                                ? 'bg-[#c9973e]/20 text-[#946b17]'
                                : req.plan_type === 'CASH_OFFICE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#4b001f]/10 text-[#4b001f]'
                            }`}
                          >
                            {req.plan_type === 'UPI_QR' && 'UPI QR Scan'}
                            {req.plan_type === 'CASH_OFFICE' && 'Cash Counter'}
                            {req.plan_type === 'FREE_REQUEST' && 'Free (Girls & Other)'}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-stone-700 mt-0.5 block">
                          📞 {req.phone_number}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {req.status === 'APPROVED' && '✓ ADMIN APPROVED'}
                        {req.status === 'PENDING' && '⏳ PENDING'}
                        {req.status === 'REJECTED' && '✗ REJECTED'}
                      </span>
                    </div>

                    {/* Request Details */}
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2 text-stone-700">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Plan:</span>
                        <strong className="text-[#4b001f]">{req.plan_name}</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Amount:</span>
                        <span className="font-serif font-bold text-sm text-stone-900">
                          {req.amount > 0 ? `₹${req.amount.toLocaleString('en-IN')}` : 'FREE'}
                        </span>
                      </div>

                      {req.utr_number && (
                        <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">
                              12-Digit UTR / Transaction No:
                            </span>
                            <span className="font-mono font-bold text-stone-900 text-xs tracking-wider">
                              {req.utr_number}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(req.utr_number!);
                              alert(`UTR ${req.utr_number} copied to clipboard!`);
                            }}
                            className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      )}

                      {req.referral_code && (
                        <div className="flex items-center justify-between bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                              Single-Use Referral Code:
                            </span>
                            <span className="font-mono font-bold text-emerald-950 text-xs tracking-wider">
                              🏷️ {req.referral_code}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            ✓ Single-Use
                          </span>
                        </div>
                      )}

                      {req.notes && (
                        <div>
                          <span className="text-stone-500 text-[11px] block">Notes / Reason:</span>
                          <p className="italic text-stone-800 bg-white p-2 rounded-lg border border-stone-100 mt-0.5">
                            "{req.notes}"
                          </p>
                        </div>
                      )}

                      {/* Payment Proof / Screenshot */}
                      {req.payment_screenshot && (
                        <div className="pt-2 border-t border-stone-200">
                          <span className="text-stone-500 text-[11px] block mb-1 font-semibold">
                            Payment Proof Screenshot / Receipt:
                          </span>
                          <div className="flex items-center gap-3">
                            <img
                              src={req.payment_screenshot}
                              alt="Payment Proof"
                              className="w-20 h-20 rounded-xl object-cover border border-stone-300 shadow-xs cursor-pointer hover:opacity-90"
                              onClick={() => setPreviewScreenshotUrl(req.payment_screenshot!)}
                            />
                            <div className="space-y-1">
                              <button
                                type="button"
                                onClick={() => setPreviewScreenshotUrl(req.payment_screenshot!)}
                                className="px-3 py-1.5 rounded-lg bg-[#4b001f] text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-[#350016] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Full Image</span>
                              </button>
                              <span className="text-[10px] text-stone-400 block">
                                Carefully verify receipt details.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-[10px] text-stone-400 pt-1">
                        Submitted: {new Date(req.created_at).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Action Buttons: Accept and Reject */}
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => onApprovePremiumRequest(req.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept & Activate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRejectPremiumRequest(req.id)}
                          className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                        <span className="text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Status: {req.status === 'APPROVED' ? 'Admin Approved' : 'Rejected'}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {req.status === 'APPROVED' && onDeactivatePremium && (
                            <button
                              type="button"
                              onClick={() => onDeactivatePremium(req.phone_number)}
                              className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold cursor-pointer"
                              title="Turn off premium plan (Admin Off)"
                            >
                              Admin Off
                            </button>
                          )}
                          {req.status === 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => onApprovePremiumRequest(req.id)}
                              className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold cursor-pointer"
                            >
                              Approve Again
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENDING ADMIN REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                  Pending Approval Requests
                </h3>
                <p className="text-xs text-stone-500">
                  Profiles submitted by users will appear on the portal only after admin approval.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                {pendingRequests.length} Pending
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-700 text-base">No pending requests!</h4>
                <p className="text-xs text-stone-500">All submitted profiles have been approved.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-lg text-[#4b001f]">
                          {p.full_name}
                        </h4>
                        <span className="text-xs text-stone-500">
                          {p.gender} · {p.marital_status} · {p.location}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        PENDING APPROVAL
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 p-3 rounded-xl bg-stone-50 text-stone-700">
                      <p>
                        <strong>Education:</strong> {p.education}
                      </p>
                      <p>
                        <strong>Profession:</strong> {p.profession}
                      </p>
                      <p>
                        <strong>Guardian Name:</strong> {p.guardian_name || 'Father'}
                      </p>
                      <p>
                        <strong>Guardian Mobile:</strong>{' '}
                        <span className="text-emerald-800 font-bold">{p.guardian_mobile || '-'}</span>
                      </p>
                      {p.about && <p className="text-stone-500 italic">"{p.about}"</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => onApproveProfile(p.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => onRejectProfile(p.id)}
                        className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL PROFILES */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2.5 items-center flex-1">
                <div className="relative min-w-[200px] flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, mobile, location..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <button
                onClick={handleCreateNewClick}
                className="px-4 py-2 rounded-xl bg-[#4b001f] text-white text-xs font-bold cursor-pointer"
              >
                + Add Profile
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Candidate</th>
                      <th className="p-3.5">Guardian Contact</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Premium</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-semibold text-stone-900">
                          {p.full_name} ({p.gender})
                          <span className="block text-[11px] text-stone-400 font-normal">
                            {p.education} · {p.profession}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {p.guardian_mobile ? (
                            <div>
                              <strong className="text-emerald-800">{p.guardian_mobile}</strong>
                              <span className="block text-[10px] text-stone-400">
                                {p.guardian_name || 'Guardian'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400">{p.mobile || 'No contact'}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-stone-600">{p.location || '-'}</td>
                        <td className="p-3.5">
                          {p.is_premium ? (
                            <span className="text-[10px] font-bold text-[#c9973e]">
                              ★ PREMIUM
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">FREE</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              p.profile_status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : p.profile_status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {p.profile_status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditClick(p)}
                              title="Edit"
                              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileToDelete(p)}
                              title="Delete Profile"
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADD / EDIT PROFILE */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 max-w-4xl">
            <h3 className="font-serif font-bold text-xl text-[#4b001f] mb-4">
              {editingProfile ? `Edit Profile: ${editingProfile.full_name}` : 'Create New Matrimony Profile'}
            </h3>

            <form onSubmit={handleSubmitProfile} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.guardian_name || ''}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    placeholder="e.g. Father or Guardian name"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.guardian_mobile || ''}
                    onChange={(e) => setFormData({ ...formData, guardian_mobile: e.target.value })}
                    placeholder="Phone number shown when unlocked"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Candidate Personal Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Only shown if no guardian number"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Location / District
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    value={formData.education || ''}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.profession || ''}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={formData.marital_status || 'Never Married'}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Profile Status
                  </label>
                  <select
                    value={formData.profile_status || 'APPROVED'}
                    onChange={(e) => setFormData({ ...formData, profile_status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="APPROVED">APPROVED (Active in Portal)</option>
                    <option value="PENDING">PENDING (Admin Request)</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Profile Photo (Gallery / URL)
                    </label>
                  </div>
                  <input
                    type="file"
                    ref={adminFileInputRef}
                    accept="image/*"
                    onChange={handleAdminPhotoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.profile_photo || ''}
                      onChange={(e) => setFormData({ ...formData, profile_photo: e.target.value })}
                      placeholder="Photo URL or choose file..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300"
                    />
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-[#4b001f] text-white text-xs font-bold hover:bg-[#350016] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Gallery</span>
                    </button>
                  </div>
                  {formData.profile_photo && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                      <img
                        src={formData.profile_photo}
                        alt="Preview"
                        className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                      />
                      <span>✓ Photo ready</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, profile_photo: '' })}
                        className="text-red-600 hover:underline ml-auto font-normal"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified & Premium Toggles */}
              <div className="p-4 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#4b001f]">
                  Privilege Flags
                </span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_verified || false}
                      onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                      className="rounded text-[#4b001f]"
                    />
                    <span>Verified Badge</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_premium || false}
                      onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                      className="rounded text-[#4b001f]"
                    />
                    <span>Active Premium Member</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  About Candidate
                </label>
                <textarea
                  rows={2}
                  value={formData.about || ''}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('profiles')}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#4b001f] pb-3 border-b border-stone-200">
              Payment Ledger & Receipts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Payer / Profile</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-stone-800">
                        {pay.transaction_reference || pay.id}
                      </td>
                      <td className="p-3 font-semibold text-stone-900">{pay.profile_name}</td>
                      <td className="p-3 font-serif font-bold text-stone-900">
                        ₹{Number(pay.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#c9973e]/20 text-[#946b17]">
                          {pay.payment_method}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          {pay.payment_status}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500">
                        {new Date(pay.payment_date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PREMIUM USERS */}
        {activeTab === 'premium' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#4b001f] pb-3 border-b border-stone-200">
              Premium Active Members
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Guardian Mobile</th>
                    <th className="p-3">Expiry</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {profiles.filter((p) => p.is_premium).map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{p.full_name}</td>
                      <td className="p-3 font-bold text-[#c9973e]">{p.premium_plan || '1 Month'}</td>
                      <td className="p-3 text-stone-700">{p.guardian_mobile || p.mobile}</td>
                      <td className="p-3 text-stone-600">{p.premium_end || '2026-12-31'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold cursor-pointer"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => onDeactivatePremium?.(p.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-[11px] font-bold cursor-pointer"
                            title="Turn off premium plan (Admin Off)"
                          >
                            Admin Off
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Female Brides</span>
                <div className="font-serif text-3xl font-bold text-[#4b001f] mt-1 tabular-nums">
                  {profiles.filter((p) => p.gender === 'Female').length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Male Grooms</span>
                <div className="font-serif text-3xl font-bold text-[#c9973e] mt-1 tabular-nums">
                  {profiles.filter((p) => p.gender === 'Male').length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Verified Profiles</span>
                <div className="font-serif text-3xl font-bold text-emerald-700 mt-1 tabular-nums">
                  {profiles.filter((p) => p.is_verified).length}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold text-stone-500">Pending Approvals</span>
                <div className="font-serif text-3xl font-bold text-amber-700 mt-1 tabular-nums">
                  {pendingRequests.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Screenshot / Proof Full Image Modal */}
      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-serif font-bold text-base text-[#4b001f] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c9973e]" />
                <span>Payment Proof / Screenshot Verification</span>
              </h4>
              <button
                type="button"
                onClick={() => setPreviewScreenshotUrl(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[72vh] overflow-auto flex items-center justify-center bg-stone-100 rounded-2xl p-2 border border-stone-200">
              <img
                src={previewScreenshotUrl}
                alt="Enlarged Payment Proof"
                className="max-h-[68vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                Verify UTR number and transfer amount carefully.
              </span>
              <button
                type="button"
                onClick={() => setPreviewScreenshotUrl(null)}
                className="px-5 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Delete Profile?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to permanently delete profile <span className="font-bold text-stone-900">{profileToDelete.full_name}</span> ({profileToDelete.gender}, {profileToDelete.district || 'Kerala'})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingProfile}
                onClick={() => setProfileToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProfile}
                onClick={async () => {
                  if (!profileToDelete) return;
                  const targetId = profileToDelete.id;
                  setIsDeletingProfile(true);
                  try {
                    await onDeleteProfile(targetId);
                  } finally {
                    setIsDeletingProfile(false);
                    setProfileToDelete(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingProfile ? 'Deleting...' : 'Delete Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
