export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  projectId?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  type: 'project-update' | 'certification' | 'general' | 'project-showcase';
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  completionDate: string;
  clientFeedback?: string;
}

export interface Connection {
  id: string;
  userId: string;
  connectionId: string;
  status: 'pending' | 'accepted';
  createdAt: string;
  workHistory: {
    companyName?: string;
    projectId?: string;
    relationship: 'colleague' | 'project-collaboration';
  };
}

export interface MeetingRequest {
  id: string;
  realtorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'accepted' | 'declined';
  notes: string;
}

export interface BookedSlot {
  date: string;
  startTime: string;
  endTime: string;
  realtorId: string;
  status: 'confirmed';
  notes: string;
}

export interface Realtor {
  id: string;
  name: string;
  email: string;
  photo: string;
  company: string;
  specialties: string[];
  bio: string;
  yearsExperience: number;
  connections: Connection[];
  role: 'realtor';
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  photo: string;
  specialty: string;
  certifications: string[];
  bio: string;
  yearsExperience: number;
  connections: Connection[];
  posts: Post[];
  portfolio: PortfolioItem[];
  availability: {
    workingHours: { start: string; end: string };
    workingDays: number[];
    meetingDuration: number;
    bookedSlots: BookedSlot[];
  };
  pendingMeetings: MeetingRequest[];
  role: 'contractor';
  company: string;
  rating: number;
}

export type User = Realtor | Contractor;

// Deprecating TimeSlot since it's not used consistently
// export interface TimeSlot {
//   date: string;
//   time: string;
// }