export type Gender = 'Male' | 'Female' | 'Other';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type PaymentStatus = 'Paid' | 'Unpaid';
export type AttendanceStatus = 'Present' | 'Absent';
export type AnnouncementType = 'Urgent' | 'Info' | 'Event';

export interface MembershipRequest {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  age: number;
  gender: Gender;
  selectedPlanId: string;
  fitnessGoal: string;
  address: string;
  message?: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Member {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  age: number;
  gender: Gender;
  planId: string;
  fitnessGoal: string;
  address: string;
  joinedDate: string;
  paymentStatus: PaymentStatus;
  attendanceStatus: AttendanceStatus;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  billing: string; // e.g. "per month", "per quarter", "per year"
  features: string[];
  isPopular?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: AnnouncementType;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface GymSettings {
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  footerText: string;
  facebookUrl?: string;
  instagramUrl?: string;
  workingHours?: string;
}
