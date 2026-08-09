import React, { useState } from 'react';
import { Search, Filter, Stethoscope, Calendar, Award, Star, X } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor } from '../types';

interface DoctorsPageProps {
  onOpenBooking: (departmentId?: string, doctorId?: string) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
  initialSearchQuery?: string;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onOpenBooking,
  onViewDoctorProfile,
  initialSearchQuery = '',
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filter logic
  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch = 
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(search.toLowerCase()) ||
      doc.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDepartment === 'all' || doc.departmentId === selectedDepartment;
    const matchesDay = selectedDay === 'all' || doc.availableDays.includes(selectedDay);

    return matchesSearch && matchesDept && matchesDay;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
          Medical Faculty & Specialists
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Find & Book Our Senior Doctors
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Browse through 160+ certified medical specialists across Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, and Emergency Trauma Medicine.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search doctor by name, qualification, or condition (e.g., 'Angioplasty', 'Knee', 'Stroke')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="fee">Lowest Consultation Fee</option>
            </select>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter By Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none"
            >
              <option value="all">All Departments ({DOCTORS.length} Doctors)</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter By OPD Availability Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 text-slate-800 focus:outline-none"
            >
              <option value="all">Any Day (Mon - Sat)</option>
              {daysList.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong>{filteredDoctors.length}</strong> matching specialists
            </span>

            {(selectedDepartment !== 'all' || selectedDay !== 'all' || search) && (
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedDay('all');
                  setSearch('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-800">No Specialists Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No doctor matched your search filters. Try resetting the department or availability day filters.
          </p>
          <button
            onClick={() => {
              setSelectedDepartment('all');
              setSelectedDay('all');
              setSearch('');
            }}
            className="bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={(doctor) => onOpenBooking(doctor.departmentId, doctor.id)}
              onViewProfile={(doctor) => onViewDoctorProfile(doctor)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
