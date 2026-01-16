
export interface Concept {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}

export interface EventRecord {
  id: string;
  name: string;
  description: string;
  folderId: string;
  createdAt: string;
  isActive: boolean;
}

export interface PhotoboothSettings {
  eventName: string;
  eventDescription: string;
  folderId: string;
  overlayImage: string | null;
  backgroundImage: string | null;
  autoResetTime: number; // seconds
  adminPin: string;
  orientation: 'portrait' | 'landscape';
  activeEventId?: string;
}

export interface GalleryItem {
  id: string;
  createdAt: string;
  conceptName: string;
  imageUrl: string;
  downloadUrl: string;
  token: string;
  eventId?: string;
}

export enum AppState {
  LANDING = 'LANDING',
  THEMES = 'THEMES',
  CAMERA = 'CAMERA',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  GALLERY = 'GALLERY',
  ADMIN = 'ADMIN'
}
