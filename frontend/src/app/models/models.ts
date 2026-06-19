// User model
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer';
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Volunteer model
export interface Volunteer {
  _id: string;
  user: string | User;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  education: string;
  skills: string[];
  availability: 'Full-Time' | 'Part-Time' | 'Weekends' | 'Flexible';
  interestArea: string;
  status: 'Active' | 'Inactive' | 'Pending';
  recommendedRole?: string;
  joinDate?: string;
  createdAt?: string;
}

// Internship model
export interface Internship {
  _id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  stipend: string;
  requirements: string[];
  skills: string[];
  openings: number;
  deadline?: string;
  isActive: boolean;
  createdBy?: string | User;
  createdAt?: string;
}

// Application model
export interface Application {
  _id: string;
  internship: string | Internship;
  applicant: string | User;
  volunteer?: string | Volunteer;
  coverLetter?: string;
  resumeLink?: string;
  status: 'Pending' | 'Shortlisted' | 'Selected' | 'Rejected';
  appliedDate: string;
  adminNote?: string;
  createdAt?: string;
}

// Certificate model
export interface Certificate {
  _id: string;
  volunteer: string | User;
  volunteerProfile?: string | Volunteer;
  certificateType: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNote?: string;
  certificateUrl?: string;
  requestedDate: string;
  resolvedDate?: string;
}

// Announcement model
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'General' | 'Internship' | 'Event' | 'Certificate' | 'Urgent';
  priority: 'Low' | 'Medium' | 'High';
  isActive: boolean;
  sendEmail?: boolean;
  createdBy?: string | User;
  createdAt?: string;
  expiryDate?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalVolunteers: number;
  activeVolunteers: number;
  newRegistrations: number;
  totalApplications: number;
  pendingCertificates: number;
  citiesCovered: number;
}

// Recommendation
export interface Recommendation {
  role: string;
  confidence: number;
  matches: string[];
  alternatives: string[];
  allRoles: string[];
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
