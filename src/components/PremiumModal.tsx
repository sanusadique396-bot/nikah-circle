import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Trash2,
  Send,
  QrCode,
  Banknote,
  Gift,
  AlertCircle,
  Copy,
  CheckCircle2,
  Tag,
  Key,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { PremiumRequest } from '../types';
import { isReferralCodeUsed, markReferralCodeUsed } from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPremiumRequest: (
    req: Omit<PremiumRequest, 'id' | 'created_at' | 'status'>
  ) => void;
  defaultUserName?: string;
  defaultUserPhone?: string;
}

const PREMIUM_PLANS = [
  {
    id: '2 Months',
    name: '2 Months Offer Plan',
    price: 499,
    originalPrice: 999,
    duration: '60 Days',
    popular: false,
  },
  {
    id: '5 Months',
    name: '5 Months Value Offer',
    price: 999,
    originalPrice: 1999,
    duration: '150 Days',
    popular: true,
  },
  {
    id: '1 Year',
    name: '1 Year VIP Offer',
    price: 1999,
    originalPrice: 4999,
    duration: '365 Days',
    popular: false,
  },
];

export const PremiumModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmitPremiumRequest,
  defaultUserName = '',
  defaultUserPhone = '',
}) => {
  // Mode: 'upi_qr' | 'cash_office' | 'free_request'
  const [activeTab, setActiveTab] = useState<'upi_qr' | 'cash_office' | 'free_request'>('upi_qr');
  const [selectedPlanId, setSelectedPlanId] = useState('5 Months');

  // Form Fields
  const [name, setName] = useState(defaultUserName);
  const [phone, setPhone] = useState(defaultUserPhone);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [notes, setNotes] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralError, setReferralError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPlan = PREMIUM_PLANS.find((p) => p.id === selectedPlanId) || PREMIUM_PLANS[1];

  const handleCopyUPI = () => {
    navigator.clipboard?.writeText('jimshadvk6@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Please choose an image file under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setScreenshot(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('ദയവായി താങ്കളുടെ പേര് രേഖപ്പെടുത്തുക (Please enter your name).');
      return;
    }
    if (!phone.trim()) {
      alert('ദയവായി മൊബൈൽ നമ്പർ രേഖപ്പെടുത്തുക (Please enter phone number).');
      return;
    }

    if (activeTab === 'upi_qr') {
      // UTR അല്ലെങ്കിൽ SCREENSHOT രണ്ടിൽ ഒന്ന് മതി
      if (!utrNumber.trim() && !screenshot) {
        alert('ശ്രദ്ധിക്കുക: 12-അക്ക UTR നമ്പർ അല്ലെങ്കിൽ പേയ്മെന്റ് സ്ക്രീൻഷോട്ട് (രണ്ടിൽ ഒന്ന്) നൽകുക.');
        return;
      }
    }

    const cleanReferralCode = referralCode.trim().toUpperCase();

    if (activeTab === 'free_request') {
      // കാരണം അല്ലെങ്കിൽ റെഫറൽ കോഡ് - രണ്ടിൽ ഏതെങ്കിലും ഒന്ന് മതി
      if (!notes.trim() && !cleanReferralCode) {
        alert('ശ്രദ്ധിക്കുക: ദയവായി കാരണം (Reason) അല്ലെങ്കിൽ റെഫറൽ കോഡ് (Referral Code) - രണ്ടിൽ ഏതെങ്കിലും ഒന്ന് നൽകുക.');
        return;
      }

      // ഒരുവട്ടം വന്ന കോഡ് പിന്നെ വരാൻ പാടില്ല
      if (cleanReferralCode) {
        if (isReferralCodeUsed(cleanReferralCode)) {
          setReferralError('ഈ റെഫറൽ കോഡ് ഇതിനകം ഉപയോഗിച്ചതാണ്! ഒരു കോഡ് ഒരു തവണ മാത്രമേ ഉപയോഗിക്കാൻ സാധിക്കൂ.');
          alert('ഈ റെഫറൽ കോഡ് ഇതിനകം ഉപയോഗിച്ചതാണ്! ഒരു കോഡ് ഒരു തവണ മാത്രമേ ഉപയോഗിക്കാൻ സാധിക്കൂ.');
          return;
        }
      }
    }

    setIsSubmitting(true);

    let planName = currentPlan.name;
    let amount = currentPlan.price;
    let planType: 'UPI_QR' | 'CASH_OFFICE' | 'FREE_REQUEST' = 'UPI_QR';

    if (activeTab === 'cash_office') {
      planType = 'CASH_OFFICE';
      planName = `${currentPlan.name} (Direct Cash Counter)`;
    } else if (activeTab === 'free_request') {
      planType = 'FREE_REQUEST';
      planName = 'Premium Free (Girls & Other)';
      amount = 0;
    }

    setTimeout(() => {
      if (cleanReferralCode) {
        markReferralCodeUsed(cleanReferralCode);
      }

      onSubmitPremiumRequest({
        user_name: name.trim(),
        phone_number: phone.trim(),
        plan_name: planName,
        plan_type: planType,
        amount,
        utr_number: utrNumber.trim() || undefined,
        payment_screenshot: screenshot || undefined,
        referral_code: cleanReferralCode || undefined,
        notes: notes.trim() || undefined,
      });

      setIsSubmitting(false);
      setSuccessMessage(
        'അൽഹംദുലില്ലാഹ്! താങ്കളുടെ പ്രീമിയം റിക്വസ്റ്റ് അഡ്മിന് സമർപ്പിച്ചു. അഡ്മിൻ പരിശോധിച്ച് അക്സെപ്റ്റ് (Approve) ചെയ്യുമ്പോൾ താങ്കളുടെ പ്രീമിയം ആക്റ്റീവ് ആകുന്നതാണ്.'
      );

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4b001f] via-[#350016] to-[#4b001f] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#c9973e]/20 text-[#c9973e] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Nikah Circle Premium
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Get Premium Membership
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              യഥാർത്ഥ UPI സ്കാനർ വഴിയോ, ഓഫീസ് ക്യാഷ് വഴിയോ, സൗജന്യ റിക്വസ്റ്റ് വഴിയോ പ്രീമിയം ആക്റ്റീവ് ആക്കാം.
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {successMessage ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#4b001f]">
                റിക്വസ്റ്റ് അഡ്മിന് സമർപ്പിച്ചു!
              </h3>
              <p className="text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
            </div>
          ) : (
            <>
              {/* Payment Mode Navigation Tabs */}
              <div className="grid grid-cols-3 p-1.5 bg-stone-100 rounded-2xl gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi_qr')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    activeTab === 'upi_qr'
                      ? 'bg-white text-[#4b001f] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#c9973e]" />
                  <span>UPI QR Scan (സ്കാനർ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cash_office')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    activeTab === 'cash_office'
                      ? 'bg-white text-[#4b001f] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Cash / Office (ഓഫീസ്)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('free_request')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    activeTab === 'free_request'
                      ? 'bg-[#4b001f] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Gift className="w-4 h-4 text-[#c9973e]" />
                  <span>PREMIUM FREE (GIRLS & OTHER)</span>
                </button>
              </div>

              {/* TAB 1: UPI QR SCANNER PAYMENT */}
              {activeTab === 'upi_qr' && (
                <div className="space-y-6">
                  {/* Select Plan */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      1. Select Plan (പാക്കേജ് തിരഞ്ഞെടുക്കുക):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {PREMIUM_PLANS.map((plan) => {
                        const isSelected = plan.id === selectedPlanId;
                        return (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#4b001f] bg-[#fff6fa] ring-2 ring-[#4b001f]'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                            }`}
                          >
                            <span className="block font-serif font-bold text-xs text-[#4b001f]">
                              {plan.name}
                            </span>
                            <span className="block font-serif text-lg font-bold text-stone-900 mt-0.5">
                              ₹{plan.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {plan.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* QR SCANNER CARD (Official image uploaded by user) */}
                  <div className="p-5 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] flex flex-col md:flex-row items-center gap-6">
                    <div className="w-48 sm:w-56 shrink-0 bg-white p-2.5 rounded-2xl shadow-md border border-[#eadfe4] text-center space-y-2">
                      <img
                        src="/assets/aistudio/WhatsApp_Image_2026-10-06_at_6.11.23_PM_c01376c7.jpeg"
                        alt="Google Pay UPI Scanner - Jimshad Vk"
                        className="w-full rounded-xl object-contain"
                      />
                      <span className="text-[11px] font-bold text-[#4b001f] block">
                        Pay ₹{currentPlan.price.toLocaleString('en-IN')}
                      </span>

                      {/* Button right below payment scanner QR code */}
                      <a
                        href={`upi://pay?pa=jimshadvk6@okaxis&pn=Jimshad%20Vk&am=${currentPlan.price}&cu=INR&tn=Nikah%20Circle%20${encodeURIComponent(currentPlan.name)}`}
                        onClick={(e) => {
                          const upiUrl = `upi://pay?pa=jimshadvk6@okaxis&pn=Jimshad%20Vk&am=${currentPlan.price}&cu=INR&tn=Nikah%20Circle%20${encodeURIComponent(currentPlan.name)}`;
                          window.location.href = upiUrl;
                        }}
                        className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                        title="Click to open Google Pay, PhonePe, Paytm, or your UPI payment app"
                      >
                        <Smartphone className="w-4 h-4 shrink-0" />
                        <span>Pay with your payment app</span>
                      </a>
                    </div>

                    <div className="space-y-3 flex-1 text-xs">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] mb-1">
                          Verified Google Pay / PhonePe / Paytm Scanner
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#4b001f]">
                          Jimshad Vk
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-white px-2 py-1 rounded-md border border-stone-200 text-stone-800 font-bold font-mono">
                            jimshadvk6@okaxis
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyUPI}
                            className="px-2 py-1 rounded-md bg-[#4b001f] text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1 text-stone-600 text-[11px] leading-relaxed">
                        <p><strong>ഘട്ടം 1:</strong> മുകളിലെ സ്കാനർ Google Pay / PhonePe / Paytm വഴി സ്കാൻ ചെയ്ത് <strong>₹{currentPlan.price}</strong> അയക്കുക.</p>
                        <p><strong>ഘട്ടം 2:</strong> പേയ്മെന്റ് ചെയ്ത ശേഷം കിട്ടുന്ന <strong>12-അക്ക UTR നമ്പർ</strong> താഴെ നൽകുക അല്ലെങ്കിൽ <strong>സ്ക്രീൻഷോട്ട്</strong> അപ്‌ലോഡ് ചെയ്യുക.</p>
                        <p><strong>ഘട്ടം 3:</strong> അഡ്മിൻ പരിശോധിച്ച് അക്സെപ്റ്റ് (Approve) ചെയ്ത ഉടൻ താങ്കളുടെ പ്രീമിയം തത്സമയം ആക്റ്റീവ് ആകും.</p>
                      </div>
                    </div>
                  </div>

                  {/* FORM TO SUBMIT UTR & SCREENSHOT */}
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          നിങ്ങളുടെ പേര് (Your Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Muhammed Salih"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          ഫോൺ നമ്പർ (Mobile Number) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98470 00000"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                        />
                      </div>
                    </div>

                    {/* Notice pill: Either UTR or Screenshot is sufficient */}
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>ശ്രദ്ധിക്കുക: 12-അക്ക UTR നമ്പറോ അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ടോ (രണ്ടിൽ ഒന്ന്) നൽകിയാൽ മതിയാകും.</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700">
                          12-Digit UTR / Transaction Reference Number
                        </label>
                        <span className="text-[10px] text-stone-500 font-medium">
                          UTR അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ട്
                        </span>
                      </div>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="e.g. 428901239841 (from Google Pay / PhonePe receipt)"
                        className="w-full px-3 py-2 font-mono rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                      />
                    </div>

                    {/* Screenshot Upload from Gallery */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700">
                          പേയ്മെന്റ് സ്ക്രീൻഷോട്ട് (സ്ക്രീൻഷോട്ട് അല്ലെങ്കിൽ UTR നൽകുക)
                        </label>
                        <span className="text-[10px] text-stone-500 font-medium">
                          രണ്ടിൽ ഒന്ന് മതി
                        </span>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />

                      {screenshot ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                          <img
                            src={screenshot}
                            alt="Payment Proof"
                            className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
                          />
                          <div className="space-y-1 flex-1">
                            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              സ്ക്രീൻഷോട്ട് തിരഞ്ഞെടുത്തു (Screenshot Attached)
                            </span>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-semibold text-[#4b001f] hover:underline cursor-pointer"
                              >
                                ഫോട്ടോ മാറ്റുക (Change)
                              </button>
                              <span>·</span>
                              <button
                                type="button"
                                onClick={() => setScreenshot('')}
                                className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                              >
                                ഒഴിവാക്കുക (Remove)
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="p-4 rounded-2xl border-2 border-dashed border-[#eadfe4] hover:border-[#4b001f] bg-stone-50 hover:bg-[#fff6fa] transition-all cursor-pointer text-center space-y-1.5"
                        >
                          <Camera className="w-6 h-6 text-[#4b001f] mx-auto" />
                          <p className="text-xs font-bold text-[#4b001f]">
                            ഗാലറിയിൽ നിന്ന് സ്ക്രീൻഷോട്ട് തിരഞ്ഞെടുക്കുക (Choose from Gallery)
                          </p>
                          <p className="text-[11px] text-stone-500">
                            ഗൂഗിൾപേ / ഫോൺപേ പേയ്മെന്റ് രസീത് ഫോട്ടോ അറ്റാച്ച് ചെയ്യുക
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-2xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-[#c9973e]" />
                      <span>
                        {isSubmitting
                          ? 'സമർപ്പിക്കുന്നു...'
                          : 'SUBMIT TO ADMIN'}
                      </span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: CASH OFFICE / DIRECT COUNTER */}
              {activeTab === 'cash_office' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] space-y-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-serif font-bold text-base text-[#4b001f]">
                        ഓഫീസ് / ഡയറക്റ്റ് കൗണ്ടർ പേയ്മെന്റ് (Cash Office Option)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      ഓഫീസിൽ നേരിട്ട് എത്തി ക്യാഷ് അടച്ചവർക്കോ, കൗണ്ടർ വഴി പ്രീമിയം എടുക്കാൻ ആഗ്രഹിക്കുന്നവർക്കോ ഇവിടെ വിവരങ്ങൾ നൽകി അഡ്മിൻ റിക്വസ്റ്റ് സമർപ്പിക്കാം.
                    </p>
                  </div>

                  {/* Plan Picker */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PREMIUM_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          plan.id === selectedPlanId
                            ? 'border-[#4b001f] bg-[#fff6fa] ring-2 ring-[#4b001f]'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <span className="block font-bold text-xs text-[#4b001f]">
                          {plan.name}
                        </span>
                        <span className="block font-serif text-lg font-bold text-stone-900 mt-0.5">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          പേര് (Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          ഫോൺ നമ്പർ (Phone Number) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98470 00000"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                        />
                      </div>
                    </div>

                    {/* Photo / Cash receipt upload */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ക്യാഷ് രസീത് / ഫോട്ടോ അപ്‌ലോഡ് (Upload Receipt Photo from Gallery)
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />

                      {screenshot ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                          <img
                            src={screenshot}
                            alt="Receipt"
                            className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
                          />
                          <div className="space-y-1 flex-1">
                            <span className="text-xs font-bold text-emerald-800">
                              ✓ രസീത് ഫോട്ടോ അറ്റാച്ച് ചെയ്തു
                            </span>
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="font-semibold text-[#4b001f] hover:underline cursor-pointer"
                              >
                                മാറ്റുക
                              </button>
                              <span>·</span>
                              <button
                                type="button"
                                onClick={() => setScreenshot('')}
                                className="font-semibold text-red-600 hover:underline cursor-pointer"
                              >
                                ഒഴിവാക്കുക
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="p-4 rounded-2xl border-2 border-dashed border-[#eadfe4] hover:border-[#4b001f] bg-stone-50 hover:bg-[#fff6fa] transition-all cursor-pointer text-center space-y-1.5"
                        >
                          <Camera className="w-6 h-6 text-[#4b001f] mx-auto" />
                          <p className="text-xs font-bold text-[#4b001f]">
                            ഗാലറിയിൽ നിന്ന് രസീത് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ഓഫീസ് / നോട്ടുകൾ (Notes)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Paid cash at Kozhikode office counter"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-2xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Banknote className="w-4 h-4 text-[#c9973e]" />
                      <span>
                        {isSubmitting
                          ? 'സമർപ്പിക്കുന്നു...'
                          : 'SUBMIT TO ADMIN'}
                      </span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: FREE PREMIUM REQUEST */}
              {activeTab === 'free_request' && (
                <div className="p-6 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-[#eadfe4] text-[#4b001f]">
                      <Gift className="w-5 h-5 text-[#c9973e]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-lg text-[#4b001f]">
                        PREMIUM FREE (GIRLS & OTHER)
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        പെൺകുട്ടികൾക്കും സാമ്പത്തിക പ്രയാസമുള്ളവർക്കും വേണ്ടിയുള്ള സൗജന്യ പ്രീമിയം റിക്വസ്റ്റ്. പ്രീമിയം ഫ്രീ എന്നാൽ പ്രീമിയം തന്നെയാണ്! പ്രീമിയത്തിന്റെ എല്ലാ ഫീച്ചറുകളും ഇതിലൂടെ ലഭിക്കും. അഡ്മിൻ പരിശോധിച്ച് അക്സെപ്റ്റ് (Approve) ചെയ്താൽ മാത്രമേ സൗജന്യ പ്രീമിയം ആക്റ്റീവ് ആകൂ.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          നിങ്ങളുടെ പേര് (Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          മൊബൈൽ നമ്പർ (Mobile Number) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98470 00000"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700">
                          സൗജന്യ പ്രീമിയം ആവശ്യപ്പെടാനുള്ള കാരണം / വിവരണം (Reason)
                        </label>
                        <span className="text-[10px] text-stone-500 font-medium">
                          കാരണം അല്ലെങ്കിൽ റെഫറൽ കോഡ്
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="സൗജന്യ പ്രീമിയം ആക്സസിനായുള്ള കാരണം..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f] bg-white"
                      />
                    </div>

                    {/* OR Divider */}
                    <div className="relative py-0.5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200" />
                      </div>
                      <div className="relative flex justify-center text-[10px] font-bold">
                        <span className="bg-[#fff6fa] px-3 text-stone-500 uppercase tracking-wider">
                          അല്ലെങ്കിൽ (OR)
                        </span>
                      </div>
                    </div>

                    {/* Single-Use Referral Code Option */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#c9973e]" />
                          <span>റെഫറൽ കോഡ് (Referral Code - Single Use)</span>
                        </label>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          രണ്ടിൽ ഏതെങ്കിലും ഒന്ന് നൽകിയാൽ മതി
                        </span>
                      </div>
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => {
                          setReferralCode(e.target.value.toUpperCase());
                          setReferralError(null);
                        }}
                        className="w-full px-3 py-2 font-mono uppercase tracking-wider rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f] bg-white text-xs font-bold text-stone-800"
                      />
                      {referralError && (
                        <p className="text-[11px] text-red-600 mt-1 font-semibold">{referralError}</p>
                      )}
                      <p className="text-[11px] text-stone-500 mt-1">
                        🔒 ശ്രദ്ധിക്കുക: ഒരു വട്ടം ഉപയോഗിച്ച റെഫറൽ കോഡ് പിന്നീട് മറ്റൊരാൾക്ക് ഉപയോഗിക്കാൻ സാധിക്കില്ല (Single-Use Only).
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-2xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-[#c9973e]" />
                      <span>
                        {isSubmitting
                          ? 'സമർപ്പിക്കുന്നു...'
                          : 'SUBMIT TO ADMIN'}
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
