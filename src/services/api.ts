export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5206/api';

export const getAuthHeaders = (isFormData: boolean = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }), 
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return headers;
};

import { UserService } from './user.service';
import { PostService } from './post.service';
import { EventService } from './event.service';
import { CommunityService } from './community.service';
import { CommentService } from './comment.service';
import { ImageService } from './image.service';

export {
  UserService,
  PostService,
  EventService,
  CommunityService,
  CommentService,
  ImageService
};