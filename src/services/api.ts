import {
  User,
  Event,
  Attendee,
  Task,
  Poll,
  Comment,
  Community,
  Post,
  FeedItem,
} from '@/types';
import {
  mockUsers,
  mockEvents,
  mockAttendees,
  mockTasks,
  mockPolls,
  mockComments,
  mockCommunities,
  mockPosts,
} from './mockData';

// Simulating network latency
const NETWORK_DELAY = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Service Layer
export const api = {
  // Feed (Mixed Events & Posts)
  async getFeed(): Promise<FeedItem[]> {
    await delay(NETWORK_DELAY);
    const eventItems: FeedItem[] = mockEvents.map(event => ({ type: 'event' as const, data: event }));
    const postItems: FeedItem[] = mockPosts.map(post => ({ type: 'post' as const, data: post }));
    
    // Combine and sort by date
    const combined = [...eventItems, ...postItems].sort((a, b) => {
      const dateA = a.type === 'event' ? a.data.date : a.data.timestamp;
      const dateB = b.type === 'event' ? b.data.date : b.data.timestamp;
      return dateB.getTime() - dateA.getTime();
    });
    
    return combined;
  },

  // Users
  async getUsers(): Promise<User[]> {
    await delay(NETWORK_DELAY);
    return mockUsers;
  },

  async getUserById(id: string): Promise<User | undefined> {
    await delay(NETWORK_DELAY);
    return mockUsers.find((user) => user.id === id);
  },

  // Events
  async getEvents(): Promise<Event[]> {
    await delay(NETWORK_DELAY);
    return mockEvents;
  },

  async getEventById(id: string): Promise<Event | undefined> {
    await delay(NETWORK_DELAY);
    return mockEvents.find((event) => event.id === id);
  },

  async getEventsByCategory(category: Event['category']): Promise<Event[]> {
    await delay(NETWORK_DELAY);
    return mockEvents.filter((event) => event.category === category);
  },

  // Attendees
  async getAttendeesByEventId(eventId: string): Promise<Attendee[]> {
    await delay(NETWORK_DELAY);
    return mockAttendees.filter((attendee) => attendee.eventId === eventId);
  },

  async getUsersAttendingEvent(eventId: string): Promise<User[]> {
    await delay(NETWORK_DELAY);
    const attendees = mockAttendees.filter((a) => a.eventId === eventId);
    return mockUsers.filter((user) =>
      attendees.some((a) => a.userId === user.id)
    );
  },

  async getFriendsGoingToEvent(eventId: string, userId: string): Promise<number> {
    await delay(NETWORK_DELAY);
    // Simulating friend logic - in real app would check friendship relations
    const attendees = mockAttendees.filter(
      (a) => a.eventId === eventId && a.userId !== userId && a.status === 'going'
    );
    return attendees.length;
  },

  // Tasks
  async getTasksByEventId(eventId: string): Promise<Task[]> {
    await delay(NETWORK_DELAY);
    return mockTasks.filter((task) => task.eventId === eventId);
  },

  async toggleTaskCompletion(taskId: string): Promise<Task | undefined> {
    await delay(NETWORK_DELAY);
    const task = mockTasks.find((t) => t.id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      return task;
    }
    return undefined;
  },

  // Polls
  async getPollsByEventId(eventId: string): Promise<Poll[]> {
    await delay(NETWORK_DELAY);
    return mockPolls.filter((poll) => poll.eventId === eventId);
  },

  async votePoll(pollId: string, optionId: string): Promise<Poll | undefined> {
    await delay(NETWORK_DELAY);
    const poll = mockPolls.find((p) => p.id === pollId);
    if (poll) {
      const option = poll.options.find((o) => o.id === optionId);
      if (option) {
        option.votes += 1;
        return poll;
      }
    }
    return undefined;
  },

  // Comments
  async getCommentsByEventId(eventId: string): Promise<Comment[]> {
    await delay(NETWORK_DELAY);
    return mockComments.filter((comment) => comment.eventId === eventId);
  },

  async addComment(
    eventId: string,
    userId: string,
    text: string
  ): Promise<Comment> {
    await delay(NETWORK_DELAY);
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      eventId,
      userId,
      text,
      timestamp: new Date(),
    };
    mockComments.push(newComment);
    return newComment;
  },

  // Communities
  async getCommunities(): Promise<Community[]> {
    await delay(NETWORK_DELAY);
    return mockCommunities;
  },

  // Posts
  async getPosts(): Promise<Post[]> {
    await delay(NETWORK_DELAY);
    return mockPosts;
  },
};
