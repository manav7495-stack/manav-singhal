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
  discountBadge?: string;
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
  googleSheetEnabled?: boolean;
  googleSheetUrl?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image_url: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  achievement: string;
  quote: string;
  rating: number;
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  watermark: string;
  image_url: string;
  button_text_1: string;
  button_text_2: string;
  badge_text: string;
  area_stat: string;
  coaches_stat: string;
  access_stat: string;
}

export interface AboutSectionFeature {
  title: string;
  desc: string;
  icon: string;
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  description_1: string;
  description_2: string;
  image_url: string;
  quote: string;
  features: AboutSectionFeature[];
}

export interface CRMIntegrationConfig {
  webhookEnabled: boolean;
  webhookUrl: string;
  webhookHeaders?: string; // JSON string of custom headers
  hubspotEnabled: boolean;
  hubspotPortalId: string;
  hubspotFormGuid: string;
  hubspotAccessToken?: string;
  mailchimpEnabled: boolean;
  mailchimpApiKey: string;
  mailchimpAudienceId: string;
  mailchimpServer?: string;
}

export interface CRMSyncLog {
  id: string;
  timestamp: string;
  leadType: 'Membership Request' | 'Contact Message';
  leadName: string;
  leadEmail: string;
  crmType: 'Webhook' | 'HubSpot' | 'Mailchimp';
  status: 'Success' | 'Failed';
  responseMessage: string;
  payloadSent: string; // JSON string of payload
}

