import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  Building2,
  Video,
  UserCheck,
  AlertCircle,
  LogIn,
  Lock,
  Cloud
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Appointment, Doctor } from '../types';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDepartmentId?: string;
  preselectedDoctorId?: string;
  onBookingSuccess: (appointment: Appointment) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDepartmentId = '',
  preselectedDoctorId = '',
  onBookingSuccess,
  onOpenAuth,
}) => {
  const { currentUser, userProfile, updateProfileData } = useAuth();

  const [departmentId, setDepartmentId] = useState<string>(preselectedDepartmentId || DEPARTMENTS[0].id);
  const [doctorId, setDoctorId] = useState<string>(preselectedDoctorId || '');
  const [appointmentType, setAppointmentType] = useState<'In-Person Consultation' | 'Video Consultation' | 'Follow-Up Checkup'>('In-Person Consultation');
  
  // Date selection - next 14 days
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('');

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>(32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [reason, setReason] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto populate patient info from logged in user
  useEffect(() => {
    if (currentUser) {
      if (!patientName) setPatientName(userProfile?.displayName || currentUser.displayName || '');
      if (!patientEmail) setPatientEmail(currentUser.email || '');
      if (!patientPhone && userProfile?.phone) setPatientPhone(userProfile.phone);
      if (userProfile?.age) setPatientAge(userProfile.age);
      if (userProfile?.gender) setPatientGender(userProfile.gender);
    }
  }, [currentUser, userProfile]);

  // Update filtered doctors when department changes
  const availableDoctors = DOCTORS.filter((d) => d.departmentId === departmentId);

  useEffect(() => {
    if (preselectedDepartmentId) {
      setDepartmentId(preselectedDepartmentId);
    }
  }, [preselectedDepartmentId]);

  useEffect(() => {
    if (preselectedDoctorId) {
      const doc = DOCTORS.find((d) => d.id === preselectedDoctorId);
      if (doc) {
        setDepartmentId(doc.departmentId);
        setDoctorId(doc.id);
      }
    } else if (availableDoctors.length > 0 && (!doctorId || !availableDoctors.some((d) => d.id === doctorId))) {
      setDoctorId(availableDoctors[0].id);
    }
  }, [departmentId, preselectedDoctorId]);

  // Set default time slot when doctor changes
  const selectedDoctorObj = DOCTORS.find((d) => d.id === doctorId);
  useEffect(() => {
    if (selectedDoctorObj && selectedDoctorObj.timeSlots.length > 0) {
      setTimeSlot(selectedDoctorObj.timeSlots[0]);
    }
  }, [doctorId]);

  if (!isOpen) return null;

  // Generate date options for the next 14 days
  const dateOptions = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { iso, dayName, monthDay, isToday: i === 0 };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!currentUser) {
      setFormError('Sign In / Sign Up is required before booking an appointment.');
      onOpenAuth('signin');
      return;
    }

    if (!patientName.trim()) {
      setFormError('Please enter the patient full name.');
      return;
    }
    if (!patientPhone.trim()) {
      setFormError('Please enter a valid phone number for SMS confirmation.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!timeSlot) {
      setFormError('Please select an available time slot.');
      return;
    }

    setIsSubmitting(true);

    try {
      const deptObj = DEPARTMENTS.find((d) => d.id === departmentId);
      const docObj = DOCTORS.find((d) => d.id === doctorId);

      const refCode = `SLH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const aptId = 'apt-' + Date.now();

      const newAppointment: Appointment = {
        id: aptId,
        userId: currentUser.uid,
        patientName,
        patientPhone,
        patientEmail,
        patientAge: Number(patientAge) || 25,
        patientGender,
        departmentId,
        departmentName: deptObj ? deptObj.name : 'General Medicine',
        doctorId,
        doctorName: docObj ? docObj.name : 'Consultant Specialist',
        date: selectedDate,
        timeSlot,
        reason: reason.trim() || 'General Health Checkup & Consultation',
        appointmentType,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        bookingReference: refCode,
      };

      // 1. Save to Firestore (if permitted by rules)
      try {
        await setDoc(doc(db, 'appointments', aptId), newAppointment);
      } catch (firestoreErr) {
        console.warn('Firestore appointment save restricted by database rules, saved locally:', firestoreErr);
      }

      // 2. Also save profile info in user document if phone/age/gender missing
      if (userProfile) {
        await updateProfileData({
          phone: patientPhone,
          age: Number(patientAge) || 25,
          gender: patientGender,
        });
      }

      // 3. Backup to localStorage
      const existing: Appointment[] = JSON.parse(localStorage.getItem('savelife_appointments') || '[]');
      localStorage.setItem('savelife_appointments', JSON.stringify([newAppointment, ...existing]));

      setIsSubmitting(false);
      onBookingSuccess(newAppointment);
      onClose();
    } catch (err: any) {
      console.error('Error in appointment submission:', err);
      setIsSubmitting(false);
      setFormError('An error occurred during booking. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 my-6">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Calendar className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Book Medical Appointment</h2>
              <p className="text-xs text-teal-100">SaveLife Hospital • Instant Online Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {!currentUser ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold">Sign In Required Before Booking</p>
                  <p className="text-amber-700 text-[11px]">Please sign in or create a patient account so your booking details are stored in your profile.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Booking for registered patient: <strong>{userProfile?.displayName || currentUser.displayName || currentUser.email}</strong></span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Firestore Linked
              </span>
            </div>
          )}

          {formError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Department & Doctor Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Select Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                Select Specialist Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.title.split(' ')[0]} - ${doc.consultationFee})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Doctor Summary Pill */}
          {selectedDoctorObj && (
            <div className="flex items-center gap-3 bg-teal-50/70 border border-teal-200/80 p-3 rounded-2xl">
              <img
                src={selectedDoctorObj.photo}
                alt={selectedDoctorObj.name}
                className="w-12 h-12 rounded-xl object-cover border border-teal-300"
              />
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-slate-900">{selectedDoctorObj.name}</h4>
                <p className="text-slate-600">{selectedDoctorObj.title}</p>
                <p className="text-teal-700 font-medium pt-0.5">
                  Fee: ${selectedDoctorObj.consultationFee} | Room: {DEPARTMENTS.find((d) => d.id === departmentId)?.roomLocation}
                </p>
              </div>
            </div>
          )}

          {/* 2. Consultation Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Consultation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { type: 'In-Person Consultation', icon: UserCheck, desc: 'Visit Hospital Campus' },
                { type: 'Video Consultation', icon: Video, desc: 'Online HD Telehealth' },
                { type: 'Follow-Up Checkup', icon: FileText, desc: 'Post-treatment Review' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = appointmentType === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setAppointmentType(item.type as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{item.type.split(' ')[0]}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Date Picker (Horizontally Scrollable Chips) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Select Appointment Date
              </span>
              <span className="text-[11px] text-teal-700 font-medium">Selected: {selectedDate}</span>
            </label>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {dateOptions.map((opt) => {
                const isSelected = selectedDate === opt.iso;
                return (
                  <button
                    type="button"
                    key={opt.iso}
                    onClick={() => setSelectedDate(opt.iso)}
                    className={`shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border transition-all min-w-[70px] ${
                      isSelected
                        ? 'bg-teal-600 text-white font-bold border-teal-600 shadow-xs scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold opacity-80">{opt.dayName}</span>
                    <span className="text-xs font-bold">{opt.monthDay}</span>
                    {opt.isToday && (
                      <span className={`text-[9px] mt-0.5 px-1 rounded ${isSelected ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-600'}`}>
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Select Time Slot
            </label>

            <div className="flex flex-wrap gap-2">
              {(selectedDoctorObj?.timeSlots || ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']).map((slot) => {
                const isSelected = timeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-teal-400 border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Patient Information Fields */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Full Patient Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mobile Number (for SMS) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Age</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Reason for Visit / Symptoms (Optional)</label>
              <textarea
                rows={2}
                placeholder="Describe your symptoms or reason for consulting the doctor..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Bottom Confirm Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Generate Booking Ticket</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
