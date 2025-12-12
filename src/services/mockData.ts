import { User, Event, Attendee, Task, Poll, Comment, Community, Post } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sofia Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    email: 'sofia@eventflow.com',
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    email: 'marcus@eventflow.com',
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    email: 'emma@eventflow.com',
  },
  {
    id: 'user-4',
    name: 'Alex Kumar',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    email: 'alex@eventflow.com',
  },
  {
    id: 'user-5',
    name: 'Isabella Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    email: 'isabella@eventflow.com',
  },
  {
    id: 'user-6',
    name: 'James Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    email: 'james@eventflow.com',
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    hostId: 'user-1',
    title: 'Summer Rooftop Party 🌅',
    description: 'Join us for an unforgettable evening under the stars! Amazing DJ, cocktails, and breathtaking city views.',
    date: new Date('2024-06-15T20:00:00'),
    location: 'Downtown Loft, 5th Floor',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    isPublic: true,
    price: 25,
    category: 'party',
  },
  {
    id: 'event-2',
    hostId: 'user-2',
    title: 'AI & Machine Learning Meetup',
    description: 'Dive deep into the latest trends in AI. Guest speakers from top tech companies. Networking session included.',
    date: new Date('2024-05-20T18:30:00'),
    location: 'Tech Hub, Conference Room A',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    isPublic: true,
    price: 0,
    category: 'tech',
  },
  {
    id: 'event-3',
    hostId: 'user-3',
    title: 'Beach Volleyball Tournament 🏐',
    description: 'Competitive tournament for all skill levels. Prizes for winners, BBQ afterwards!',
    date: new Date('2024-06-01T10:00:00'),
    location: 'Sunset Beach, Court 3',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    isPublic: true,
    price: 15,
    category: 'sports',
  },
  {
    id: 'event-4',
    hostId: 'user-4',
    title: 'Live Jazz Night 🎷',
    description: 'Smooth jazz vibes with The Blue Notes Quartet. Premium cocktails and tapas menu available.',
    date: new Date('2024-05-18T21:00:00'),
    location: 'The Underground Jazz Club',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    isPublic: true,
    price: 30,
    category: 'music',
  },
  {
    id: 'event-5',
    hostId: 'user-5',
    title: 'Sushi Making Workshop 🍣',
    description: 'Learn from Chef Takashi! All ingredients provided. Take home recipes and new skills.',
    date: new Date('2024-05-25T17:00:00'),
    location: 'Culinary Arts School',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    isPublic: false,
    price: 65,
    category: 'food',
  },
  {
    id: 'event-6',
    hostId: 'user-6',
    title: 'Contemporary Art Exhibition',
    description: 'Featuring emerging local artists. Wine & cheese reception. Gallery tour at 7pm.',
    date: new Date('2024-06-08T18:00:00'),
    location: 'Modern Art Gallery',
    imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    isPublic: true,
    price: 20,
    category: 'art',
  },
  {
    id: 'event-7',
    hostId: 'user-1',
    title: 'Startup Founders Networking',
    description: 'Connect with fellow entrepreneurs. Panel discussion, pitch sessions, and drinks.',
    date: new Date('2024-05-22T19:00:00'),
    location: 'Innovation Hub',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    isPublic: true,
    price: 0,
    category: 'networking',
  },
  {
    id: 'event-8',
    hostId: 'user-2',
    title: 'Midnight Rave: Neon Dreams 💫',
    description: 'Electronic music festival. 3 stages, international DJs. Glow sticks & face paint included!',
    date: new Date('2024-06-10T23:00:00'),
    location: 'Warehouse District',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    isPublic: true,
    price: 45,
    category: 'party',
  },
  {
    id: 'event-9',
    hostId: 'user-3',
    title: 'Yoga in the Park 🧘',
    description: 'Morning flow for all levels. Bring your mat. Coffee & smoothies after.',
    date: new Date('2024-05-19T08:00:00'),
    location: 'Central Park, Main Lawn',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    isPublic: true,
    price: 10,
    category: 'sports',
  },
  {
    id: 'event-10',
    hostId: 'user-4',
    title: 'Wine Tasting Experience 🍷',
    description: 'Sample 10 premium wines from around the world. Expert sommelier guide. Cheese pairings included.',
    date: new Date('2024-06-05T19:30:00'),
    location: 'Vineyard Estate',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    isPublic: false,
    price: 85,
    category: 'food',
  },
];

// Mock Attendees
export const mockAttendees: Attendee[] = [
  { eventId: 'event-1', userId: 'user-1', status: 'going', role: 'host' },
  { eventId: 'event-1', userId: 'user-2', status: 'going', role: 'guest' },
  { eventId: 'event-1', userId: 'user-3', status: 'going', role: 'guest' },
  { eventId: 'event-1', userId: 'user-4', status: 'maybe', role: 'guest' },
  { eventId: 'event-2', userId: 'user-2', status: 'going', role: 'host' },
  { eventId: 'event-2', userId: 'user-5', status: 'going', role: 'guest' },
  { eventId: 'event-3', userId: 'user-3', status: 'going', role: 'host' },
  { eventId: 'event-3', userId: 'user-1', status: 'going', role: 'guest' },
  { eventId: 'event-4', userId: 'user-4', status: 'going', role: 'host' },
  { eventId: 'event-5', userId: 'user-5', status: 'going', role: 'host' },
];

// Mock Tasks
export const mockTasks: Task[] = [
  { id: 'task-1', eventId: 'event-1', text: 'Book DJ', assignedToUserId: 'user-1', isCompleted: true },
  { id: 'task-2', eventId: 'event-1', text: 'Order decorations', assignedToUserId: 'user-2', isCompleted: false },
  { id: 'task-3', eventId: 'event-1', text: 'Arrange catering', assignedToUserId: null, isCompleted: false },
  { id: 'task-4', eventId: 'event-2', text: 'Confirm speakers', assignedToUserId: 'user-2', isCompleted: true },
  { id: 'task-5', eventId: 'event-3', text: 'Get volleyball nets', assignedToUserId: 'user-3', isCompleted: false },
];

// Mock Polls
export const mockPolls: Poll[] = [
  {
    id: 'poll-1',
    eventId: 'event-1',
    question: 'Which music genre should we play?',
    options: [
      { id: 'opt-1', text: 'House', votes: 12 },
      { id: 'opt-2', text: 'Hip-Hop', votes: 8 },
      { id: 'opt-3', text: 'Reggaeton', votes: 15 },
    ],
  },
  {
    id: 'poll-2',
    eventId: 'event-2',
    question: 'Preferred workshop topic?',
    options: [
      { id: 'opt-4', text: 'Computer Vision', votes: 18 },
      { id: 'opt-5', text: 'NLP', votes: 22 },
      { id: 'opt-6', text: 'Reinforcement Learning', votes: 10 },
    ],
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    eventId: 'event-1',
    userId: 'user-2',
    text: "Can't wait! Should I bring anything? 🎉",
    timestamp: new Date('2024-05-10T14:30:00'),
  },
  {
    id: 'comment-2',
    eventId: 'event-1',
    userId: 'user-1',
    text: 'Just bring good vibes! Everything else is covered 😎',
    timestamp: new Date('2024-05-10T14:45:00'),
  },
  {
    id: 'comment-3',
    eventId: 'event-1',
    userId: 'user-3',
    text: 'Is there a dress code?',
    timestamp: new Date('2024-05-10T15:00:00'),
  },
  {
    id: 'comment-4',
    eventId: 'event-2',
    userId: 'user-5',
    text: 'Will there be Q&A time with speakers?',
    timestamp: new Date('2024-05-12T10:20:00'),
  },
  {
    id: 'comment-5',
    eventId: 'event-2',
    userId: 'user-2',
    text: 'Yes! 30 minutes at the end of each session.',
    timestamp: new Date('2024-05-12T10:25:00'),
  },
];

// Mock Communities
export const mockCommunities: Community[] = [
  {
    id: 'community-1',
    name: 'Senderismo Goya',
    iconUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=150',
    memberCount: 245,
  },
  {
    id: 'community-2',
    name: 'Devs Corrientes',
    iconUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=150',
    memberCount: 892,
  },
  {
    id: 'community-3',
    name: 'Foodies United',
    iconUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150',
    memberCount: 1203,
  },
  {
    id: 'community-4',
    name: 'Arte Moderno',
    iconUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150',
    memberCount: 567,
  },
  {
    id: 'community-5',
    name: 'Runners Club',
    iconUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=150',
    memberCount: 423,
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-2',
    content: '¿Alguien sabe de un buen lugar para cenar esta noche? Busco algo con terraza 🍽️',
    type: 'text',
    timestamp: new Date('2024-05-16T18:20:00'),
    likes: 12,
    commentCount: 5,
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    content: 'Increíble atardecer desde el mirador! 🌅',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    type: 'image',
    timestamp: new Date('2024-05-17T19:45:00'),
    likes: 34,
    commentCount: 8,
  },
  {
    id: 'post-3',
    authorId: 'user-5',
    content: '¿Alguien se apunta a una sesión de paddle este fin de semana? 🎾',
    type: 'text',
    timestamp: new Date('2024-05-18T10:15:00'),
    likes: 8,
    commentCount: 12,
  },
  {
    id: 'post-4',
    authorId: 'user-1',
    content: 'Nuevo setup para trabajar desde casa! Qué opinan? 💻',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    type: 'image',
    timestamp: new Date('2024-05-19T14:30:00'),
    likes: 28,
    commentCount: 6,
  },
  {
    id: 'post-5',
    authorId: 'user-4',
    content: 'Recomiendo el nuevo café que abrió en el centro. Excelente ambiente y café de especialidad ☕',
    type: 'text',
    timestamp: new Date('2024-05-20T09:00:00'),
    likes: 15,
    commentCount: 4,
  },
];
