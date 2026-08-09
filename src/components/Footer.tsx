import React from 'react';
import { 
  HeartPulse, 
  MapPin, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { HOSPITAL_INFO, DEPARTMENTS } from '../data/hospitalData';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'about' | 'departments' | 'doctors' | 'appointments' | 'admin') => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBooking }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Emergency Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">SaveLife Hospital</span>
                <p className="text-xs text-slate-400">Center for Medical Excellence</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              SaveLife Hospital is a tertiary healthcare center committed to bringing human touch and cutting-edge medical technology to patient care across 20+ specialized disciplines.
            </p>

            {/* Emergency Hotline Box */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 max-w-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider">24/7 Emergency Dispatch</span>
                  <a href={`tel:${HOSPITAL_INFO.emergencyNumber}`} className="block text-lg font-bold text-white hover:text-teal-400 transition-colors">
                    {HOSPITAL_INFO.emergencyNumber}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">JCI & NABH Accredited Tertiary Center</span>
            </div>
          </div>

          {/* Navigation Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Page', tab: 'home' },
                { label: 'About SaveLife', tab: 'about' },
                { label: 'Medical Departments', tab: 'departments' },
                { label: 'Specialist Doctors', tab: 'doctors' },
                { label: 'My Bookings', tab: 'appointments' },
                { label: 'Admin Portal', tab: 'admin' },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setActiveTab(link.tab as any);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 hover:text-teal-400 transition-colors text-slate-400"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Departments
            </h4>
            <ul className="space-y-2 text-xs">
              {DEPARTMENTS.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      setActiveTab('departments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-teal-400 transition-colors text-slate-400 line-clamp-1 text-left"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Hospital Location
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{HOSPITAL_INFO.address}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{HOSPITAL_INFO.generalEnquiry}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{HOSPITAL_INFO.email}</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-2">
              <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-300">OPD Timings:</p>
                <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                <p className="text-rose-400 font-medium">ER open 24 Hours / 365 Days</p>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="mt-2 w-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
            >
              Book Online Consultation
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SaveLife Hospital. All rights reserved. Compassionate Care & Advanced Medicine.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Rights & Responsibilities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
