export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  title: string;
  photo: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availableDays: string[];
  timeSlots: string[];
  bio: string;
  languages: string[];
  specializations: string[];
  email: string;
  phone: string;
  educationHistory: string[];
  awards?: string[];
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  shortDescription: string;
  longDescription: string;
  headDoctorName: string;
  bedCount: number;
  keyServices: string[];
  roomLocation: string;
  bannerImage: string;
  doctorIds: string[];
  emergencySupport: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  createdAt?: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  reason: string;
  appointmentType: 'In-Person Consultation' | 'Video Consultation' | 'Follow-Up Checkup';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  bookingReference: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age: number;
  treatment: string;
  quote: string;
  rating: number;
  doctorName: string;
  date: string;
  avatar: string;
}

export interface HospitalStat {
  label: string;
  value: string;
  description: string;
  iconName: string;
}
