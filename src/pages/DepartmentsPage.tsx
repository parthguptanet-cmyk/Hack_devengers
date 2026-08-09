import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Calendar, 
  ChevronRight, 
  Search,
  Star,
  Award
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Department, Doctor } from '../types';

interface DepartmentsPageProps {
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onOpenBooking,
  onViewDoctorProfile,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS[0].id);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepts = DEPARTMENTS.filter((d) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.keyServices.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeDepartment = DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];
  const departmentDoctors = DOCTORS.filter((doc) => doc.departmentId === activeDepartment.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
          Clinical Specialties
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          SaveLife Medical Departments
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Each department is led by experienced senior consultants, backed by state-of-the-art diagnostic labs and dedicated inpatient wards.
        </p>

        {/* Search bar */}
        <div className="max-w-md pt-2">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 shadow-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search department or medical service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Department Selector + Right Detailed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Department List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Department ({filteredDepts.length})
          </h3>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredDepts.map((dept) => {
              const isSelected = dept.id === activeDepartment.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    isSelected ? 'bg-teal-500 text-slate-950' : 'bg-teal-50 text-teal-600'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm leading-tight">{dept.name}</h4>
                      {dept.emergencySupport && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700'
                        }`}>
                          24/7 ER
                        </span>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {dept.shortDescription}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Department View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6">
            
            {/* Dept Header Banner */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              <img
                src={activeDepartment.bannerImage}
                alt={activeDepartment.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-400/30">
                    {activeDepartment.roomLocation}
                  </span>
                  {activeDepartment.emergencySupport && (
                    <span className="bg-rose-500/20 text-rose-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-400/30">
                      24/7 Emergency Triage Active
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeDepartment.name}
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Head of Department: <strong className="text-teal-300">{activeDepartment.headDoctorName}</strong> • {activeDepartment.bedCount} Dedicated Inpatient Beds
                </p>
              </div>
            </div>

            {/* Dept Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Clinical Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeDepartment.longDescription}
                </p>
              </div>

              {/* Key Services Checklist */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Procedures & Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDepartment.keyServices.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctors under this Department */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Specialist Doctors in {activeDepartment.name.split('&')[0]}
                  </h3>
                  <span className="text-xs text-slate-500">{departmentDoctors.length} Doctors Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departmentDoctors.map((doc) => (
                    <div key={doc.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                        />
                        <div className="text-xs">
                          <h4 className="font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-slate-500 line-clamp-1">{doc.qualification}</p>
                          <span className="text-teal-700 font-semibold">{doc.experienceYears}+ Yrs Exp • ${doc.consultationFee}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenBooking(activeDepartment.id, doc.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs shrink-0"
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Department OPD Hours</span>
                  <span className="text-xs font-bold text-slate-900">Monday - Saturday (8:00 AM - 8:00 PM)</span>
                </div>

                <button
                  onClick={() => onOpenBooking(activeDepartment.id)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Department Appointment</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
