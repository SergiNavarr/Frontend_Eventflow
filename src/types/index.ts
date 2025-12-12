// Database Models

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
}

export interface Event {
  id: string;
  hostId: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
  isPublic: boolean;
  price: number;
  category: 'party' | 'tech' | 'sports' | 'music' | 'food' | 'art' | 'networking';
}

export type AttendeeStatus = 'going' | 'maybe' | 'invited';
export type AttendeeRole = 'host' | 'guest';

export interface Attendee {
  eventId: string;
  userId: string;
  status: AttendeeStatus;
  role: AttendeeRole;
}

export interface Task {
  id: string;
  eventId: string;
  text: string;
  assignedToUserId: string | null;
  isCompleted: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  eventId: string;
  question: string;
  options: PollOption[];
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  timestamp: Date;
}

export interface Community {
  id: string;
  name: string;
  iconUrl: string;
  memberCount: number;
}

export type PostType = 'text' | 'image';

export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  type: PostType;
  timestamp: Date;
  likes: number;
  commentCount: number;
}

export type FeedItem = 
  | { type: 'event'; data: Event }
  | { type: 'post'; data: Post };
