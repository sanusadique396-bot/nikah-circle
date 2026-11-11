import React from 'react';
import { Search, RotateCcw, Filter, CheckCircle2, Sparkles, MapPin, Briefcase, GraduationCap } from 'lucide-react';
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

const KERALA_DISTRICTS = [
  'All Districts',
  'Kozhikode',
  'Malappuram',
  'Kannur',
  'Ernakulam',
  'Thiruvananthapuram',
  'Thrissur',
  'Palakkad',
  'Kollam',
  'Alappuzha',
  'Kottayam',
  'Kasaragod',
  'Wayanad',
  'Idukki',
  'Pathanamthitta',
  'Outside Kerala / Gulf'
];

const PROFESSIONS = [
  'All Professions',
  'Doctor / Medical',
  'Software Engineer / IT',
  'Engineer (Civil / Mech / Elec)',
  'Teacher / Professor',
  'Business / Entrepreneur',
  'Government Officer',
  'Banking & Finance',
  'Nursing & Healthcare',
  'Accountant',
  'Gulf / NRI Professional',
  'Student',
  'Other'
];

const EDUCATIONS = [
  'All Qualifications',
  'Post Graduate / Master\'s',
  'B.Tech / Engineering',
  'MBBS / Medical Degree',
  'Graduate / Degree',
  'Diploma',
  'Plus Two / Higher Secondary'
];

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
  return (
    <div className="bg-white rounded-2xl border border-[#eadfe4] shadow-sm p-5 space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#fff6fa] text-[#4b001f] border border-[#eadfe4]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#4b001f] leading-none">
              ഫിൽട്ടർ & സെർച്ച് (Advanced Filters)
            </h2>
            <span className="text-[11px] text-stone-500 font-medium">
              ആകെ {totalCount} പ്രൊഫൈലുകളിൽ {filteredCount} എണ്ണം പൊരുത്തപ്പെടുന്നു
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isUserPremium && (
            <button
              onClick={onOpenPremium}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#c9973e] text-white text-[11px] font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>Get Premium</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="text-xs font-semibold text-stone-500 hover:text-[#4b001f] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Grid of All Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {/* 1. Keyword / Name / Place Search */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            പേര് / കീവേഡ് (Keyword Search)
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="e.g. Doctor, Kozhikode, Manjeri..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] focus:ring-1 focus:ring-[#4b001f] bg-stone-50/50"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 2. Looking For (Gender) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            ലിംഗം (Looking For)
          </label>
          <select
            value={filters.gender}
            onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">All Genders (എല്ലാം)</option>
            <option value="Female">Bride (പെൺകുട്ടി / Female)</option>
            <option value="Male">Groom (ആൺകുട്ടി / Male)</option>
          </select>
        </div>

        {/* 3. District / Region */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            ജില്ല (District)
          </label>
          <select
            value={filters.district}
            onChange={(e) => onFilterChange({ ...filters, district: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            {KERALA_DISTRICTS.map((dist) => (
              <option key={dist} value={dist === 'All Districts' ? '' : dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Place / City Specific Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            സ്ഥലം / നഗരം (Place / Town)
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.place}
              onChange={(e) => onFilterChange({ ...filters, place: e.target.value })}
              placeholder="e.g. Manjeri, Vadakara, Edappally..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] focus:ring-1 focus:ring-[#4b001f] bg-white"
            />
            <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 5. Profession / Job Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            തൊഴിൽ / ജോലി (Profession / Job)
          </label>
          <div className="relative">
            <select
              value={filters.profession}
              onChange={(e) => onFilterChange({ ...filters, profession: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
            >
              {PROFESSIONS.map((prof) => (
                <option key={prof} value={prof === 'All Professions' ? '' : prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6. Education Qualification */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            വിദ്യാഭ്യാസം (Education)
          </label>
          <div className="relative">
            <select
              value={filters.education}
              onChange={(e) => onFilterChange({ ...filters, education: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
            >
              {EDUCATIONS.map((edu) => (
                <option key={edu} value={edu === 'All Qualifications' ? '' : edu}>
                  {edu}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 7. Age Bracket */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            പ്രായം (Age Bracket)
          </label>
          <select
            value={filters.ageRange}
            onChange={(e) => onFilterChange({ ...filters, ageRange: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">Any Age (എല്ലാ പ്രായവും)</option>
            <option value="18-24">18 – 24 Years</option>
            <option value="25-29">25 – 29 Years</option>
            <option value="30-34">30 – 34 Years</option>
            <option value="35-42">35 – 42 Years</option>
            <option value="43+">43+ Years</option>
          </select>
        </div>

        {/* 8. Marital Status */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            വൈവാഹികാവസ്ഥ (Marital Status)
          </label>
          <select
            value={filters.maritalStatus}
            onChange={(e) => onFilterChange({ ...filters, maritalStatus: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#eadfe4] focus:outline-none focus:border-[#4b001f] bg-white text-stone-800"
          >
            <option value="">Any Status (എല്ലാം)</option>
            <option value="Never Married">Never Married (വിവാഹം കഴിക്കാത്തവർ)</option>
            <option value="Divorced">Divorced (വിവാഹമോചിതർ)</option>
            <option value="Widowed">Widowed (വിധവ / വിഭാര്യൻ)</option>
          </select>
        </div>
      </div>

      {/* Checkboxes Row */}
      <div className="flex flex-wrap items-center gap-6 pt-2 text-xs border-t border-stone-100">
        <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700 select-none">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#4b001f] border-stone-300 focus:ring-[#4b001f]"
          />
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Profiles Only</span>
        </label>

        <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-stone-700 select-none">
          <input
            type="checkbox"
            checked={filters.premiumOnly}
            onChange={(e) => onFilterChange({ ...filters, premiumOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#c9973e] border-stone-300 focus:ring-[#c9973e]"
          />
          <Sparkles className="w-3.5 h-3.5 text-[#c9973e]" />
          <span>Premium Featured Profiles Only</span>
        </label>
      </div>
    </div>
  );
};
