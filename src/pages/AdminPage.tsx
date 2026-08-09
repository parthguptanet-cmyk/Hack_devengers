import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogIn, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  AlertCircle, 
  Building2, 
  Edit3, 
  Trash2, 
  Printer, 
  DollarSign, 
  RefreshCw, 
  Check, 
  ChevronDown, 
  Cloud, 
  UserPlus, 
  X,
  FileSpreadsheet,
  Activity
} from 'lucide-react';
import { Appointment, Doctor, Department } from '../types';
import { DEPARTMENTS, DOCTORS, HOSPITAL_INFO } from '../data/hospitalData';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminPageProps {
  onSelectTicket: (apt: Appointment) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onSelectTicket }) => {
  const { currentUser, isAdmin, signIn, logout } = useAuth();

  // Admin login form state
  const [adminEmailInput, setAdminEmailInput] = useState('shubhankar_rao@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('121212');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // New/Edit Form state
  const [formPatientName, setFormPatientName] = useState('');
  const [formPatientPhone, setFormPatientPhone] = useState('');
  const [formPatientEmail, setFormPatientEmail] = useState('');
  const [formPatientAge, setFormPatientAge] = useState<number>(30);
  const [formPatientGender, setFormPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formDeptId, setFormDeptId] = useState<string>(DEPARTMENTS[0].id);
  const [formDoctorId, setFormDoctorId] = useState<string>(DOCTORS[0].id);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTimeSlot, setFormTimeSlot] = useState<string>('10:00 AM');
  const [formType, setFormType] = useState<'In-Person Consultation' | 'Video Consultation' | 'Follow-Up Checkup'>('In-Person Consultation');
  const [formStatus, setFormStatus] = useState<'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'>('Confirmed');
  const [formReason, setFormReason] = useState('');
  const [formError, setFormError] = useState('');
  const [isSavingForm, setIsSavingForm] = useState(false);

  // Handle Admin Sign In
  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await signIn(adminEmailInput.trim(), adminPasswordInput);
      setLoginLoading(false);
    } catch (err: any) {
      console.error('Admin login error:', err);
      setLoginLoading(false);
      setLoginError(err.message || 'Invalid admin email or password.');
    }
  };

  // Subscribe to all appointments in Firestore
  useEffect(() => {
    if (!isAdmin) return;

    setLoadingData(true);

    const q = collection(db, 'appointments');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Appointment), id: docSnap.id });
      });

      // Sort by newest created date first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setAppointments(items);
      setLoadingData(false);
    }, (err) => {
      console.warn('Firestore subscription restricted, falling back to local storage:', err);
      const saved = localStorage.getItem('savelife_appointments');
      if (saved) {
        try {
          setAppointments(JSON.parse(saved));
        } catch (e) {}
      }
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Quick doctor filter sync
  useEffect(() => {
    const docsInDept = DOCTORS.filter((d) => d.departmentId === formDeptId);
    if (docsInDept.length > 0 && !docsInDept.some((d) => d.id === formDoctorId)) {
      setFormDoctorId(docsInDept[0].id);
    }
  }, [formDeptId]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingAppointment(null);
    setFormPatientName('');
    setFormPatientPhone('+1 (555) ');
    setFormPatientEmail('');
    setFormPatientAge(35);
    setFormPatientGender('Male');
    setFormDeptId(DEPARTMENTS[0].id);
    setFormDoctorId(DOCTORS[0].id);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTimeSlot('10:00 AM');
    setFormType('In-Person Consultation');
    setFormStatus('Confirmed');
    setFormReason('Routine Consultation');
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setFormPatientName(apt.patientName);
    setFormPatientPhone(apt.patientPhone);
    setFormPatientEmail(apt.patientEmail);
    setFormPatientAge(apt.patientAge || 30);
    setFormPatientGender(apt.patientGender || 'Male');
    setFormDeptId(apt.departmentId);
    setFormDoctorId(apt.doctorId);
    setFormDate(apt.date);
    setFormTimeSlot(apt.timeSlot);
    setFormType(apt.appointmentType);
    setFormStatus(apt.status);
    setFormReason(apt.reason);
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Submit Add or Edit
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formPatientName.trim()) {
      setFormError('Patient name is required.');
      return;
    }
    if (!formPatientPhone.trim()) {
      setFormError('Patient phone number is required.');
      return;
    }

    setIsSavingForm(true);

    try {
      const deptObj = DEPARTMENTS.find((d) => d.id === formDeptId);
      const docObj = DOCTORS.find((d) => d.id === formDoctorId);

      const aptId = editingAppointment ? editingAppointment.id : 'apt-' + Date.now();
      const refCode = editingAppointment
        ? editingAppointment.bookingReference
        : `SLH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const savedApt: Appointment = {
        id: aptId,
        userId: editingAppointment?.userId || currentUser?.uid || 'admin-created',
        patientName: formPatientName.trim(),
        patientPhone: formPatientPhone.trim(),
        patientEmail: formPatientEmail.trim() || 'patient@savelife.org',
        patientAge: Number(formPatientAge) || 30,
        patientGender: formPatientGender,
        departmentId: formDeptId,
        departmentName: deptObj ? deptObj.name : 'General Medicine',
        doctorId: formDoctorId,
        doctorName: docObj ? docObj.name : 'Specialist Doctor',
        date: formDate,
        timeSlot: formTimeSlot,
        appointmentType: formType,
        status: formStatus,
        reason: formReason.trim() || 'Medical Checkup',
        createdAt: editingAppointment ? editingAppointment.createdAt : new Date().toISOString(),
        bookingReference: refCode,
      };

      // 1. Save to Firestore
      try {
        await setDoc(doc(db, 'appointments', aptId), savedApt);
      } catch (err) {
        console.warn('Firestore setDoc failed, saving to local state:', err);
      }

      // 2. Backup in localStorage
      const existing: Appointment[] = JSON.parse(localStorage.getItem('savelife_appointments') || '[]');
      const filtered = existing.filter((a) => a.id !== aptId);
      localStorage.setItem('savelife_appointments', JSON.stringify([savedApt, ...filtered]));

      // Update local state if needed
      setAppointments((prev) => {
        const withoutOld = prev.filter((a) => a.id !== aptId);
        return [savedApt, ...withoutOld];
      });

      setIsSavingForm(false);
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('Error saving appointment:', err);
      setIsSavingForm(false);
      setFormError(err.message || 'Failed to save booking.');
    }
  };

  // Quick Status Change
  const handleStatusChange = async (aptId: string, newStatus: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled') => {
    // Update local state
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === aptId ? { ...apt, status: newStatus } : apt))
    );

    // Update localStorage
    const saved: Appointment[] = JSON.parse(localStorage.getItem('savelife_appointments') || '[]');
    const updated = saved.map((apt) => (apt.id === aptId ? { ...apt, status: newStatus } : apt));
    localStorage.setItem('savelife_appointments', JSON.stringify(updated));

    // Update Firestore
    try {
      await updateDoc(doc(db, 'appointments', aptId), { status: newStatus });
    } catch (err) {
      console.warn('Firestore updateDoc failed:', err);
    }
  };

  // Delete Appointment
  const handleDelete = async (aptId: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment permanently?')) return;

    setAppointments((prev) => prev.filter((a) => a.id !== aptId));

    const saved: Appointment[] = JSON.parse(localStorage.getItem('savelife_appointments') || '[]');
    localStorage.setItem('savelife_appointments', JSON.stringify(saved.filter((a) => a.id !== aptId)));

    try {
      await deleteDoc(doc(db, 'appointments', aptId));
    } catch (err) {
      console.warn('Firestore deleteDoc failed:', err);
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchRef = apt.bookingReference.toLowerCase().includes(q);
      const matchPhone = apt.patientPhone.includes(q);
      const matchDoctor = apt.doctorName.toLowerCase().includes(q);
      const matchDept = apt.departmentName.toLowerCase().includes(q);
      if (!matchName && !matchRef && !matchPhone && !matchDoctor && !matchDept) {
        return false;
      }
    }

    // Status match
    if (selectedStatusFilter !== 'ALL' && apt.status !== selectedStatusFilter) {
      return false;
    }

    // Department match
    if (selectedDeptFilter !== 'ALL' && apt.departmentId !== selectedDeptFilter) {
      return false;
    }

    // Doctor match
    if (selectedDoctorFilter !== 'ALL' && apt.doctorId !== selectedDoctorFilter) {
      return false;
    }

    // Date match
    if (selectedDateFilter && apt.date !== selectedDateFilter) {
      return false;
    }

    return true;
  });

  // Calculate Metrics
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const totalFeeRevenue = appointments
    .filter((a) => a.status !== 'Cancelled')
    .reduce((sum, a) => {
      const docObj = DOCTORS.find((d) => d.id === a.doctorId);
      return sum + (docObj ? docObj.consultationFee : 100);
    }, 0);

  // IF NOT ADMIN: Show Admin Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900/95 my-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 text-center relative">
            <div className="w-16 h-16 bg-teal-500/20 rounded-2xl border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-teal-400 tracking-widest uppercase">
              SaveLife Hospital
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Admin Portal Login
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Restricted management area. Only authorized hospital staff and administrators can access patient bookings.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 space-y-4">
            
            {loginError && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Quick One-Click Admin Auto Login Button */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-teal-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Admin Credentials Demo
                </span>
                <span className="bg-teal-200 text-teal-900 text-[10px] px-2 py-0.5 rounded-md">Configured</span>
              </div>
              <p className="text-[11px] text-teal-700">
                Email: <strong className="font-mono text-teal-900">shubhankar_rao@gmail.com</strong>
                <br />
                Password: <strong className="font-mono text-teal-900">121212</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setAdminEmailInput('shubhankar_rao@gmail.com');
                  setAdminPasswordInput('121212');
                  handleAdminLogin();
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Quick Login as Admin</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-teal-400 font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loginLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Admin Access</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    );
  }

  // IF ADMIN IS AUTHENTICATED: Show Full Admin Portal
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Super Admin Command Portal
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
              <Cloud className="w-3 h-3" /> Live Firestore Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hospital Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Logged in as <strong className="text-teal-400">{currentUser?.email}</strong>. View, filter, modify, or insert appointment records across all medical departments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Booking</span>
          </button>

          <button
            onClick={() => logout()}
            className="bg-white/10 hover:bg-white/20 text-rose-300 font-semibold text-xs px-4 py-3 rounded-2xl transition-all border border-white/10"
          >
            Sign Out Admin
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</span>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
          <p className="text-[10px] text-slate-500">All registered tokens</p>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmed
          </span>
          <p className="text-2xl font-black text-emerald-950">{confirmedCount}</p>
          <p className="text-[10px] text-emerald-700">Scheduled OPDs</p>
        </div>

        <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
            <Clock3 className="w-3 h-3 text-blue-600" />
            Pending
          </span>
          <p className="text-2xl font-black text-blue-950">{pendingCount}</p>
          <p className="text-[10px] text-blue-700">Awaiting check-in</p>
        </div>

        <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-teal-800 uppercase flex items-center gap-1">
            <Check className="w-3 h-3 text-teal-600" />
            Completed
          </span>
          <p className="text-2xl font-black text-teal-950">{completedCount}</p>
          <p className="text-[10px] text-teal-700">Consultation done</p>
        </div>

        <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
          <p className="text-2xl font-black text-rose-950">{cancelledCount}</p>
          <p className="text-[10px] text-rose-700">Revoked tokens</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-teal-400 uppercase flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Est. Revenue
          </span>
          <p className="text-2xl font-black text-white">${totalFeeRevenue}</p>
          <p className="text-[10px] text-slate-400">Total Consultation Fees</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search patient name, booking ref, phone, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none max-w-[150px]"
            >
              <option value="ALL">All Depts</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Doctor Filter */}
            <select
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none max-w-[150px]"
            >
              <option value="ALL">All Doctors</option>
              {DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />

            {(searchQuery || selectedStatusFilter !== 'ALL' || selectedDeptFilter !== 'ALL' || selectedDoctorFilter !== 'ALL' || selectedDateFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatusFilter('ALL');
                  setSelectedDeptFilter('ALL');
                  setSelectedDoctorFilter('ALL');
                  setSelectedDateFilter('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-2 underline"
              >
                Reset Filters
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Bookings Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              All Patient Appointments ({filteredAppointments.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click status pill to quickly change appointment state
          </span>
        </div>

        {loadingData ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <span className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs font-semibold">Loading bookings from Firestore database...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No matching appointment records found.</p>
            <button
              onClick={handleOpenAddModal}
              className="bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
            >
              Add First Booking
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-4">Ref Code & Schedule</th>
                  <th className="p-4">Patient Information</th>
                  <th className="p-4">Doctor & Department</th>
                  <th className="p-4">Consultation Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredAppointments.map((apt) => {
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Ref Code & Date */}
                      <td className="p-4 space-y-1">
                        <span className="font-mono text-[11px] font-bold bg-slate-900 text-teal-400 px-2 py-0.5 rounded">
                          {apt.bookingReference}
                        </span>
                        <div className="text-slate-900 font-bold flex items-center gap-1 pt-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{apt.timeSlot}</span>
                        </div>
                      </td>

                      {/* Patient Info */}
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-slate-900 text-sm">{apt.patientName}</p>
                        <p className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{apt.patientPhone}</span>
                        </p>
                        <p className="text-slate-500 text-[11px] flex items-center gap-1 truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{apt.patientEmail}</span>
                        </p>
                        <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mt-1">
                          {apt.patientAge || 30} yrs • {apt.patientGender || 'Male'}
                        </span>
                      </td>

                      {/* Doctor & Specialty */}
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{apt.doctorName}</span>
                        </p>
                        <p className="text-slate-600 text-[11px]">{apt.departmentName}</p>
                        <p className="text-slate-400 text-[10px] italic truncate max-w-[180px]">
                          "{apt.reason}"
                        </p>
                      </td>

                      {/* Type */}
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-block">
                          {apt.appointmentType}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : apt.status === 'Pending'
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : apt.status === 'Completed'
                              ? 'bg-teal-50 border-teal-300 text-teal-800'
                              : 'bg-rose-50 border-rose-300 text-rose-800'
                          }`}
                        >
                          <option value="Confirmed">● Confirmed</option>
                          <option value="Pending">● Pending</option>
                          <option value="Completed">● Completed</option>
                          <option value="Cancelled">● Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectTicket(apt)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Print / View OPD Ticket"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(apt)}
                            className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors"
                            title="Edit Appointment Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add / Edit Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 my-6 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    {editingAppointment ? 'Edit Appointment Record' : 'Create New Booking (Admin End)'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {editingAppointment ? `Modifying booking ref ${editingAppointment.bookingReference}` : 'Manually register a patient consultation in SaveLife database'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Patient Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Details</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    placeholder="e.g. Robert Vance"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formPatientPhone}
                      onChange={(e) => setFormPatientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Email</label>
                    <input
                      type="email"
                      value={formPatientEmail}
                      onChange={(e) => setFormPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={formPatientAge}
                      onChange={(e) => setFormPatientAge(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formPatientGender}
                      onChange={(e) => setFormPatientGender(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Doctor & Schedule Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor & Schedule</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={formDeptId}
                      onChange={(e) => setFormDeptId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Consulting Doctor</label>
                    <select
                      value={formDoctorId}
                      onChange={(e) => setFormDoctorId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      {DOCTORS.filter((d) => d.departmentId === formDeptId).map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={formTimeSlot}
                      onChange={(e) => setFormTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Mode</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="In-Person Consultation">In-Person Consultation</option>
                      <option value="Video Consultation">Video Consultation</option>
                      <option value="Follow-Up Checkup">Follow-Up Checkup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Symptoms</label>
                  <textarea
                    rows={2}
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder="Chief complaint or consultation reason..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingForm}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingForm ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingAppointment ? 'Update Booking' : 'Save Booking to Database'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
