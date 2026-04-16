export interface Caregiver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  certifications: string[];
  experience: number;
  bio: string;
  location: string;
  availability: AvailabilitySlot[];
  languages: string[];
  isVerified: boolean;
  isAvailable: boolean;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface CareRequest {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverAvatar: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  totalAmount: number;
  careType: string;
  patientName: string;
  address: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  address: string;
  role: 'family' | 'caregiver';
}
