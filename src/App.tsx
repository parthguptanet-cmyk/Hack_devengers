import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AdminPage } from './pages/AdminPage';
import { AppointmentModal } from './components/AppointmentModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { TicketSummaryModal } from './components/TicketSummaryModal';
import { AuthModal } from './components/AuthModal';
import { Doctor, Appointment } from './types';
import { PhoneCall, ShieldAlert } from 'lucide-react';
import { HOSPITAL_INFO } from './data/hospitalData';
import { AuthProvider } from './context/AuthContext';

function SaveLifeApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'departments' | 'doctors' | 'appointments' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedDeptId, setPreselectedDeptId] = useState<string>('');
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string>('');

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<Doctor | null>(null);
  const [confirmedAppointmentTicket, setConfirmedAppointmentTicket] = useState<Appointment | null>(null);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenBooking = (departmentId?: string, doctorId?: string) => {
    setPreselectedDeptId(departmentId || '');
    setPreselectedDoctorId(doctorId || '');
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newAppointment: Appointment) => {
    setConfirmedAppointmentTicket(newAppointment);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
      {/* Sticky Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={handleOpenBooking}
        onOpenAuth={handleOpenAuth}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'doctors') {
            setActiveTab('doctors');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={handleOpenBooking}
            onViewDoctorProfile={(doc) => setSelectedDoctorForProfile(doc)}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentsPage
            onOpenBooking={handleOpenBooking}
            onViewDoctorProfile={(doc) => setSelectedDoctorForProfile(doc)}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorsPage
            onOpenBooking={handleOpenBooking}
            onViewDoctorProfile={(doc) => setSelectedDoctorForProfile(doc)}
            initialSearchQuery={searchQuery}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsPage
            onOpenBooking={() => handleOpenBooking()}
            onOpenAuth={handleOpenAuth}
            onSelectAppointmentTicket={(apt) => setConfirmedAppointmentTicket(apt)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            onSelectTicket={(apt) => setConfirmedAppointmentTicket(apt)}
          />
        )}
      </main>

      {/* Floating Emergency Callout Widget (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <a
          href={`tel:${HOSPITAL_INFO.emergencyNumber}`}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-3 rounded-full shadow-2xl border-2 border-white animate-bounce transition-transform active:scale-95"
          title="24/7 Emergency Ambulance & Trauma Line"
        >
          <ShieldAlert className="w-5 h-5 text-white" />
          <span className="hidden sm:inline">24/7 ER: {HOSPITAL_INFO.emergencyNumber}</span>
        </a>
      </div>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedDepartmentId={preselectedDeptId}
        preselectedDoctorId={preselectedDoctorId}
        onBookingSuccess={handleBookingSuccess}
        onOpenAuth={handleOpenAuth}
      />

      <DoctorDetailModal
        doctor={selectedDoctorForProfile}
        onClose={() => setSelectedDoctorForProfile(null)}
        onBook={(doc) => handleOpenBooking(doc.departmentId, doc.id)}
      />

      <TicketSummaryModal
        appointment={confirmedAppointmentTicket}
        onClose={() => setConfirmedAppointmentTicket(null)}
        onViewAllAppointments={() => {
          setActiveTab('appointments');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SaveLifeApp />
    </AuthProvider>
  );
}
