import React, { useState } from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  ShieldAlert, 
  Search, 
  Calendar, 
  Users, 
  Award, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  Star, 
  ChevronRight,
  Activity,
  Microscope,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { HOSPITAL_INFO, HOSPITAL_STATS, DEPARTMENTS, DOCTORS, TESTIMONIALS, FAQS } from '../data/hospitalData';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor } from '../types';

interface HomePageProps {
  onNavigate: (tab: 'home' | 'about' | 'departments' | 'doctors' | 'appointments') => void;
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
  searchQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onViewDoctorProfile,
  searchQuery,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick hero search state
  const [heroDept, setHeroDept] = useState('');
  const [heroDoctor, setHeroDoctor] = useState('');

  // Filter doctors for featured showcase
  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
    const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(heroDept || undefined, heroDoctor || undefined);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Background Decorative Graphic */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>24/7 Level 1 Emergency & Trauma Care Unit</span>
              </div>

              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Compassionate Care. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200">
                  Advanced Medicine.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Welcome to SaveLife Hospital. Providing multi-specialty healthcare, robotic surgeries, and internationally accredited medical experts across 20+ specialized disciplines.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Online</span>
                </button>

                <button
                  onClick={() => onNavigate('doctors')}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-teal-300" />
                  <span>Find a Specialist</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  JCI Gold Seal Accredited
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  500+ ICU & Private Beds
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  35+ Cashless Insurance Panels
                </span>
              </div>
            </div>

            {/* Right Quick Search / Booking Box */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Find & Book Doctor</h3>
                    <p className="text-xs text-slate-500">Instant OPD slot allocation</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Search className="w-5 h-5" />
                  </div>
                </div>

                <form onSubmit={handleHeroSearchSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      1. Select Specialty
                    </label>
                    <select
                      value={heroDept}
                      onChange={(e) => {
                        setHeroDept(e.target.value);
                        setHeroDoctor('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">All Departments & Specialties</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      2. Choose Specialist Doctor
                    </label>
                    <select
                      value={heroDoctor}
                      onChange={(e) => setHeroDoctor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Any Available Doctor</option>
                      {DOCTORS.filter((d) => !heroDept || d.departmentId === heroDept).map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.departmentName.split('&')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Same-day and Next-day OPD slots available!</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Proceed to Slot Selection</span>
                  </button>
                </form>

                {/* Direct Emergency Call Button */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <a
                    href={`tel:${HOSPITAL_INFO.emergencyNumber}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Need Immediate Trauma Care? Call {HOSPITAL_INFO.emergencyNumber}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOSPITAL STATS BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {HOSPITAL_STATS.map((stat, i) => (
            <div key={i} className={`space-y-2 text-center ${i > 0 ? 'pt-4 lg:pt-0' : ''}`}>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-600 tracking-tight">
                {stat.value}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{stat.label}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
              Medical Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Centers of Clinical Excellence
            </h2>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 group"
          >
            <span>Explore All 8 Departments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.slice(0, 8).map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-600 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {dept.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{dept.doctorIds.length} Specialists</span>
                <button
                  onClick={() => onOpenBooking(dept.id)}
                  className="font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  Book OPD <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DOCTORS SHOWCASE */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
                Medical Faculty
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Meet Our Senior Specialist Doctors
              </h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedDeptFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full shrink-0 transition-colors ${
                  selectedDeptFilter === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Specialists
              </button>
              {DEPARTMENTS.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDeptFilter(d.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full shrink-0 transition-colors ${
                    selectedDeptFilter === d.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.name.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDoctors.slice(0, 8).map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={(doctor) => onOpenBooking(doctor.departmentId, doctor.id)}
                onViewProfile={(doctor) => onViewDoctorProfile(doctor)}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
            >
              <span>View All 160+ Hospital Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. WHY CHOOSE SAVELIFE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
            The SaveLife Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Patients & Families Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Combining empathetic patient care with modern robotic surgery, 24/7 ICU infrastructure, and international clinical protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Activity,
              title: '24/7 Level 1 Emergency & ICU',
              description: 'Dedicated resuscitation bays, ACLS mobile ambulances, and instant trauma team response within 60 seconds.',
            },
            {
              icon: Microscope,
              title: 'Robotic & Minimal Access Surgery',
              description: 'State-of-the-art robotic surgical suites for orthopedic joint replacements, cardiac valves, and tumor excisions.',
            },
            {
              icon: Award,
              title: 'JCI & NABH Accreditation',
              description: 'Highest standards of infection control, patient safety protocols, and certified medical outcome quality.',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PATIENT TESTIMONIALS */}
      <section className="bg-teal-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">
              Patient Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Real Experiences From Our Recovered Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div key={item.id} className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                  <img
                    src={item.avatar}
                    alt={item.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-teal-400/30"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{item.patientName} ({item.age} yrs)</h4>
                    <p className="text-[11px] text-teal-300">{item.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Got Questions About OPD & Appointments?
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BOTTOM BOOKING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Need a Doctor Consultation?</h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
              Book your slot online in less than 2 minutes. Receive instant SMS token verification and priority OPD queueing.
            </p>
          </div>

          <button
            onClick={() => onOpenBooking()}
            className="shrink-0 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>Book Your Appointment Now</span>
          </button>
        </div>
      </section>

    </div>
  );
};
