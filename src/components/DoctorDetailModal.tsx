import React from 'react';
import { 
  X, 
  Star, 
  Award, 
  Clock, 
  Calendar, 
  Languages, 
  CheckCircle2, 
  Phone, 
  Mail, 
  GraduationCap, 
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({ doctor, onClose, onBook }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-8">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-teal-400/50 shadow-lg shrink-0"
            />

            <div className="text-center sm:text-left space-y-2">
              <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-teal-400/30">
                <Stethoscope className="w-3 h-3" />
                {doctor.departmentName}
              </span>
              <h2 className="text-2xl font-bold text-white">{doctor.name}</h2>
              <p className="text-sm text-slate-300 font-medium">{doctor.title}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold">{doctor.experienceYears} Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Biography */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About Doctor</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Award className="w-4 h-4 text-teal-600" />
                <span className="font-semibold">{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Languages className="w-4 h-4 text-slate-400" />
                <span>Languages: {doctor.languages.join(', ')}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Available: {doctor.availableDays.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Consultation Fee: <strong className="text-slate-900">${doctor.consultationFee}</strong></span>
              </div>
            </div>
          </div>

          {/* Specialization Checklist */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Core Medical Specializations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doctor.specializations.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Awards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Education & Qualifications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {doctor.educationHistory.map((edu, i) => (
                  <li key={i}>{edu}</li>
                ))}
              </ul>
            </div>

            {doctor.awards && doctor.awards.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Honors & Recognitions
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {doctor.awards.map((award, i) => (
                    <li key={i}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Time slots preview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Standard OPD Slot Schedule</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.timeSlots.map((slot, idx) => (
                <span key={idx} className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Consultation Fee</span>
              <span className="text-2xl font-bold text-slate-900">${doctor.consultationFee}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all"
            >
              <span>Book Appointment With Doctor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
