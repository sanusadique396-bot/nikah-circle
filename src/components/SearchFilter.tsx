import React from 'react';
import { Search, RotateCcw, Filter, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { SearchFilters } from '../types';

interface Props {
  filters: SearchFilters;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  isUserPremium: boolean;
  onOpenPremium: () => void;
}

export const SearchFilter: React.FC<Props> = ({
  filters,
  searchQuery,
  onSearchChange,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
  isUserPremium,
  onOpenPremium,
}) => {
  if (!isUserPremium) {
    return (
      <div className="bg-gradient-to-r from-[#fff6fa] via-white to-[#fff6fa] rounded-2xl border border-[#c9973e]/40 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#4b001f] text-[#c9973e] flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#4b001f] flex items-center gap-2">
              <span>പ്രീമിയം സെർച്ച് & ഫിൽട്ടർ ഫീച്ചർ</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#c9973e] text-[#350016]">
                Premium Only
              </span>
            </h3>
            <p className="text-xs text-stone-600 mt-0.5 max-w-xl">
              പ്രീമിയം മെമ്പർഷിപ്പ് ഉള്ളവർക്ക് മാത്രമേ പ്രൊഫൈലുകൾ ഡിസ്ട്രിക്റ്റ്, വയസ്സ്, ക്വാളിഫിക്കേഷൻ അനുസരിച്ച് സെർച്ച് ചെയ്യാനും ബയോഡാറ്റ ഇൻട്രസ്റ്റ് അയക്കാനും സാധിക്കൂ.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPremium}
          className="px-5 py-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 shrink-0 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c9973e]" />
          <span>Unlock Search with Premium</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#eadfe4] shadow-sm p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#4b001f]" />
          <h2 className="font-serif text-lg font-bold text-[#4b001f]">
            Filter & Search Profiles
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            ({filteredCount} of {totalCount} matching)
          </span>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-semibold text-stone-500 hover:text-[#4b001f] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Search Query */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Keyword / Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="e.g. Doctor, Kozhikode..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] focus:ring-1 focus:ring-[#4b001f] bg-stone-50/50"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Looking For
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">All Genders</option>
            <option value="Female">Bride (Female)</option>
            <option value="Male">Groom (Male)</option>
          </select>
        </div>

        {/* Age Range */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Age Bracket
          </label>
          <select
            value={filters.ageRange}
            onChange={(e) => onFilterChange({ ...filters, ageRange: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">Any Age</option>
            <option value="18-24">18 – 24 Years</option>
            <option value="25-29">25 – 29 Years</option>
            <option value="30-34">30 – 34 Years</option>
            <option value="35-42">35 – 42 Years</option>
            <option value="43+">43+ Years</option>
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Marital Status
          </label>
          <select
            value={filters.maritalStatus}
            onChange={(e) => onFilterChange({ ...filters, maritalStatus: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">Any Status</option>
            <option value="Never Married">Never Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        {/* Location / District */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            District / Region
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">All Locations</option>
            <option value="Kozhikode">Kozhikode (Calicut)</option>
            <option value="Malappuram">Malappuram</option>
            <option value="Kochi">Kochi / Ernakulam</option>
            <option value="Kannur">Kannur</option>
            <option value="Thiruvananthapuram">Thiruvananthapuram</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Palakkad">Palakkad</option>
            <option value="Kollam">Kollam</option>
            <option value="Wayanad">Wayanad</option>
            <option value="Kasaragod">Kasaragod</option>
            <option value="Dubai">Dubai / UAE</option>
            <option value="Saudi">Saudi Arabia</option>
            <option value="Qatar">Qatar</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700 select-none">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#4b001f] border-stone-300 focus:ring-[#4b001f]"
          />
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Show Admin-Verified Profiles Only</span>
        </label>
      </div>
    </div>
  );
};
