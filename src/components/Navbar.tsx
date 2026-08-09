import React, { useState } from 'react';
import { 
  HeartPulse, 
  PhoneCall, 
  Calendar, 
  Menu, 
  X, 
  ShieldAlert, 
  Stethoscope, 
  Building2, 
  Users, 
  Info,
  Clock,
  Search,
  LogIn,
  LogOut,
  UserCheck,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'home' | 'about' | 'departments' | 'doctors' | 'appointments' | 'admin';
  setActiveTab: (tab: 'home' | 'about' | 'departments' | 'doctors' | 'appointments' | 'admin') => void;
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: HeartPulse },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ] as const;

  const handleNavClick = (tab: 'home' | 'about' | 'departments' | 'doctors' | 'appointments' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-100">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              24/7 Emergency & Trauma Desk Active
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              OPD Hours: Mon-Sat 8:00 AM - 8:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href={`tel:${HOSPITAL_INFO.emergencyNumber}`} 
              className="flex items-center gap-1.5 font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-800/40"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              Emergency: {HOSPITAL_INFO.emergencyNumber}
            </a>
            <span className="hidden lg:inline text-slate-500">|</span>
            <a 
              href={`tel:${HOSPITAL_INFO.generalEnquiry}`}
              className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              Helpline: {HOSPITAL_INFO.generalEnquiry}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                SaveLife
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 uppercase tracking-wider">
                Hospital
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5 font-medium">
              Care & Advanced Medical Center
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search trigger */}
          <div className="relative hidden sm:block">
            {showSearchInput ? (
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-300">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search doctor or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-44"
                  autoFocus
                />
                <button 
                  onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                title="Search Doctors or Departments"
                className="p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Account / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {(userProfile?.displayName || currentUser.displayName || 'P').charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate">
                  {userProfile?.displayName || currentUser.displayName || 'Patient'}
                </span>
                <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {userProfile?.displayName || currentUser.displayName || 'Patient'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    {userProfile?.phone && (
                      <p className="text-[10px] text-teal-600 font-medium mt-0.5">{userProfile.phone}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('appointments');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>My Booked Appointments</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveTab('admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      <span>Admin Command Center</span>
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('signin')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-lg transition-all"
            >
              <LogIn className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* Appointment CTA */}
          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm shadow-teal-600/20 active:scale-[0.98] transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 md:hidden hover:bg-slate-100 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          {/* Mobile search */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 mb-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-teal-50 text-teal-800 font-semibold border-l-4 border-teal-600' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {link.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
            {currentUser ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {(userProfile?.displayName || currentUser.displayName || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs truncate">
                    <p className="font-bold text-slate-900 truncate">
                      {userProfile?.displayName || currentUser.displayName || 'Patient'}
                    </p>
                    <p className="text-slate-500 text-[10px] truncate">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('signin');
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-teal-400 font-semibold py-2.5 rounded-xl text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Patient Sign In / Register</span>
              </button>
            )}

            <a
              href={`tel:${HOSPITAL_INFO.emergencyNumber}`}
              className="flex items-center justify-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 font-semibold py-2.5 rounded-xl text-sm"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Emergency Helpline: {HOSPITAL_INFO.emergencyNumber}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
