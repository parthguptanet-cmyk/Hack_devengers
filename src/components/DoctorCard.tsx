import React from 'react';
import { Star, Award, Calendar, DollarSign, Languages, ChevronRight, Stethoscope } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onViewProfile: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-200 transition-all group flex flex-col h-full overflow-hidden">
      {/* Header Image & Badge */}
      <div className="relative h-56 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
        
        {/* Department Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
          <Stethoscope className="w-3 h-3 text-teal-400" />
          <span>{doctor.departmentName.split('&')[0]}</span>
        </div>

        {/* Experience Chip */}
        <div className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
          {doctor.experienceYears}+ Yrs Exp
        </div>

        {/* Name & Title Over Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-lg leading-snug drop-shadow-xs group-hover:text-teal-200 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs text-slate-200 line-clamp-1 font-medium">{doctor.title}</p>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5 text-xs">
          {/* Qualifications */}
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="line-clamp-1">{doctor.qualification}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold text-xs border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{doctor.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-500">({doctor.reviewCount} verified patient reviews)</span>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Speaks: {doctor.languages.join(', ')}</span>
          </div>

          {/* Available Days */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="line-clamp-1">Days: {doctor.availableDays.join(', ')}</span>
          </div>
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {doctor.specializations.slice(0, 2).map((spec, i) => (
            <span key={i} className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
              {spec}
            </span>
          ))}
          {doctor.specializations.length > 2 && (
            <span className="text-[11px] text-slate-400 self-center">+{doctor.specializations.length - 2} more</span>
          )}
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Fee</span>
            <span className="text-base font-bold text-slate-900">${doctor.consultationFee}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewProfile(doctor)}
              className="text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 px-2.5 py-2 rounded-lg transition-colors"
            >
              Profile
            </button>
            
            <button
              onClick={() => onBook(doctor)}
              className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-xs active:scale-[0.98]"
            >
              <span>Book</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
