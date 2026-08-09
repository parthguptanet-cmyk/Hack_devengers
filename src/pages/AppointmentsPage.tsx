import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  CheckCircle2, 
  FileText, 
  Trash2, 
  Printer, 
  Plus, 
  Building2,
  AlertCircle,
  LogIn,
  Cloud,
  Loader2
} from 'lucide-react';
import { Appointment } from '../types';
import { HOSPITAL_INFO } from '../data/hospitalData';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AppointmentsPageProps {
  onOpenBooking: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSelectAppointmentTicket: (appointment: Appointment) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  onOpenBooking,
  onOpenAuth,
  onSelectAppointmentTicket,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      // Fallback to local storage if user not logged in
      const saved = localStorage.getItem('savelife_appointments');
      if (saved) {
        try {
          setAppointments(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setAppointments([]);
      }
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to Firestore appointments for current user
    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Appointment), id: docSnap.id });
      });

      // Sort by createdAt desc
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setAppointments(items);
      setLoading(false);
    }, (err) => {
      console.error('Firestore listener error:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('savelife_appointments');
      if (saved) {
        try {
          setAppointments(JSON.parse(saved));
        } catch (e) {}
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment token?')) {
      // Local update
      const updated = appointments.map((apt) => 
        apt.id === id ? { ...apt, status: 'Cancelled' as const } : apt
      );
      setAppointments(updated);
      localStorage.setItem('savelife_appointments', JSON.stringify(updated));

      // Firestore update if logged in
      if (currentUser) {
        try {
          await updateDoc(doc(db, 'appointments', id), { status: 'Cancelled' });
        } catch (err) {
          console.error('Firestore cancel error:', err);
        }
      }
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Remove this appointment record from view?')) {
      const updated = appointments.filter((apt) => apt.id !== id);
      setAppointments(updated);
      localStorage.setItem('savelife_appointments', JSON.stringify(updated));

      if (currentUser) {
        try {
          await deleteDoc(doc(db, 'appointments', id));
        } catch (err) {
          console.error('Firestore delete error:', err);
        }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Patient Portal
            </span>
            {currentUser && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Firebase Firestore Connected
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            My Appointments & OPD Tokens
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your scheduled doctor consultations, view OPD slip tokens, and print receipts.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Auth Banner if signed out */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal-800/40">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-teal-300 flex items-center justify-center sm:justify-start gap-2">
              <LogIn className="w-5 h-5 text-teal-400" />
              Sign In to Access Cloud Synchronized Appointments
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Create an account or sign in to save your appointments directly to your SaveLife patient profile in Firebase Firestore and access them anytime.
            </p>
          </div>
          <button
            onClick={() => onOpenAuth('signin')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all shrink-0"
          >
            Sign In / Register Now
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading your appointment records from Firebase Firestore...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-teal-600 mx-auto" />
          <h3 className="font-bold text-xl text-slate-900">No Appointments Scheduled</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            You haven't booked any OPD consultation tokens yet. Click below to choose a department or doctor and book your appointment.
          </p>
          <button
            onClick={onOpenBooking}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Book Appointment Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const isCancelled = apt.status === 'Cancelled';
            return (
              <div
                key={apt.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isCancelled ? 'border-rose-200 bg-rose-50/20 opacity-75' : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                {/* Left Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-teal-400 px-2.5 py-1 rounded-md">
                      {apt.bookingReference}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isCancelled
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      ● {apt.status}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Booked on: {new Date(apt.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Doctor & Specialty</span>
                      <p className="font-bold text-slate-900 text-sm">{apt.doctorName}</p>
                      <p className="text-slate-600">{apt.departmentName}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Appointment Schedule</span>
                      <p className="font-bold text-teal-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {apt.date} at {apt.timeSlot}
                      </p>
                      <p className="text-slate-600">{apt.appointmentType}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 pt-1 border-t border-slate-100 flex flex-wrap items-center gap-4">
                    <span>Patient: <strong className="text-slate-900">{apt.patientName}</strong> ({apt.patientPhone})</span>
                    <span>Reason: <em className="text-slate-700">{apt.reason}</em></span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {!isCancelled && (
                    <button
                      onClick={() => onSelectAppointmentTicket(apt)}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-400" />
                      <span>Print Slip</span>
                    </button>
                  )}

                  {!isCancelled ? (
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2.5 rounded-xl transition-colors border border-rose-200"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 p-2"
                      title="Remove Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
