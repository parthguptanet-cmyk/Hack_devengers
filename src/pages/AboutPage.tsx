import React from 'react';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Users, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Microscope, 
  Calendar,
  PhoneCall
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface AboutPageProps {
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking }) => {
  const milestones = [
    { year: '1998', title: 'Hospital Inception', desc: 'SaveLife Hospital opened its doors as a 100-bed multi-specialty center.' },
    { year: '2006', title: 'Heart & Vascular Center', desc: 'Established State-of-the-art Flat Panel Cath Lab for round-the-clock angioplasty.' },
    { year: '2014', title: 'JCI Gold Seal Accreditation', desc: 'Achieved prestigious international accreditation for patient safety & clinical standards.' },
    { year: '2020', title: 'Robotic Surgery & Expansion', desc: 'Expanded to 500+ beds, introducing robotic orthopedic joint replacement and 3T MRI.' },
    { year: '2026', title: 'Smart Healthcare & Telehealth', desc: 'Launched AI-assisted diagnostics and 24/7 digital OPD consultation services.' },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">
            About SaveLife Hospital
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            28 Years of Healing with Compassion & Precision
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Founded with a vision to make tertiary medical care accessible, empathetic, and technologically superior for every patient.
          </p>
        </div>
      </section>

      {/* Hospital Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-5">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
              Our Vision & Mission
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              A Tertiary Healthcare Beacon Designed Around Patient Comfort
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              SaveLife Hospital integrates 20+ specialized clinical departments, over 160 internationally trained doctors, and 500+ critical care beds under one roof. Our multidisciplinary tumor boards, hybrid cardiac OTs, and level-3 neonatal ICUs ensure seamless, life-saving care.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span>Patient-First Philosophy with 24/7 Dedicated Caregivers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span>Infection-Free Modular OTs with HEPA Air Filtration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span>Cashless TPA Desks for 35+ Major Insurance Providers</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Schedule a Visit
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200"
              alt="SaveLife Hospital Facility"
              className="rounded-3xl shadow-2xl border border-slate-200 object-cover w-full h-[420px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-5 rounded-2xl shadow-xl hidden sm:block border border-slate-700">
              <p className="text-2xl font-extrabold text-teal-400">99.4%</p>
              <p className="text-xs text-slate-300">Patient Satisfaction Score</p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Guided by Ethics, Excellence & Empathy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Empathetic Compassion',
                desc: 'Treating every patient like family with warmth, dignity, and personalized care.',
              },
              {
                icon: Award,
                title: 'Clinical Excellence',
                desc: 'Adhering to international evidence-based treatment guidelines and clinical quality controls.',
              },
              {
                icon: ShieldCheck,
                title: 'Uncompromising Safety',
                desc: 'Rigorous infection control, zero-error medication dispensing, and JCI compliance.',
              },
              {
                icon: Sparkles,
                title: 'Surgical Innovation',
                desc: 'Pioneering minimally invasive laparoscopic and robotic surgical techniques.',
              },
            ].map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{val.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
            Our Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Milestones Over the Decades
          </h2>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-ml-px before:w-0.5 before:bg-slate-200">
          {milestones.map((m, idx) => (
            <div key={idx} className={`relative flex items-center gap-6 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
              
              <div className="w-full sm:w-1/2 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {m.year}
                </span>
                <h3 className="font-bold text-base text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>

              {/* Circle node */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-600 border-4 border-white shadow-xs" />
            </div>
          ))}
        </div>
      </section>

      {/* Hospital Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
            Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Advanced Medical Facilities
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '3T Digital MRI & 128-Slice CT',
              image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
              desc: 'High-resolution neuro and cardiac imaging with ultra-fast scan speeds.',
            },
            {
              title: 'Flat-Panel Cardiac Cath Lab',
              image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
              desc: 'Dedicated electrophysiology and emergency coronary angioplasty suite.',
            },
            {
              title: 'Modular Infection-Free OTs',
              image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
              desc: 'Laminar airflow and robotic surgery navigation for zero-infection operations.',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group shadow-xs">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5 space-y-1.5">
                <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
