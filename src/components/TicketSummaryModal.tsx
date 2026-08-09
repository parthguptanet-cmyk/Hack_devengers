import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Stethoscope, 
  Building2,
  Share2,
  FileText
} from 'lucide-react';
import { Appointment } from '../types';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface TicketSummaryModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onViewAllAppointments: () => void;
}

export const TicketSummaryModal: React.FC<TicketSummaryModalProps> = ({
  appointment,
  onClose,
  onViewAllAppointments,
}) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden">
        
        {/* Banner */}
        <div className="bg-emerald-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Appointment Confirmed!</h2>
          <p className="text-xs text-emerald-100">SaveLife Hospital • OPD Token Slip</p>
        </div>

        {/* Ticket Printable Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          
          {/* Reference Code Box */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Booking Reference Token</span>
              <span className="text-xl font-mono font-bold text-teal-400">{appointment.bookingReference}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Status</span>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ● {appointment.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4 text-xs">
            
            {/* Doctor & Dept */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  Assigned Specialist
                </span>
                <p className="text-sm font-bold text-slate-900">{appointment.doctorName}</p>
                <p className="text-slate-600 text-[11px]">{appointment.departmentName}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  Hospital Location
                </span>
                <p className="text-sm font-bold text-slate-900">Main OPD Block</p>
                <p className="text-slate-600 text-[11px]">{HOSPITAL_INFO.address.split(',')[0]}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-200/60">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Date</span>
                  <span className="text-xs font-bold text-slate-900">{appointment.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Time Slot</span>
                  <span className="text-xs font-bold text-slate-900">{appointment.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Patient Records</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name</span>
                  <strong className="text-slate-900">{appointment.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Contact</span>
                  <strong>{appointment.patientPhone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Age / Gender</span>
                  <strong>{appointment.patientAge} yrs, {appointment.patientGender}</strong>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 block text-[10px]">Consultation Mode & Reason</span>
                <p className="text-slate-800 font-medium">
                  {appointment.appointmentType} — "{appointment.reason}"
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px]">
              <p className="font-semibold mb-0.5">⚠️ Important Patient Instructions:</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                <li>Please arrive 15 minutes prior to your scheduled time slot at the OPD counter.</li>
                <li>Show this booking reference code or registered phone number at reception.</li>
                <li>For any rescheduling, call our helpline at {HOSPITAL_INFO.generalEnquiry}.</li>
              </ul>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Slip</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onViewAllAppointments();
                }}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>View My Appointments</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
