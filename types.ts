import React from 'react';

export interface UserProfile {
  brandName: string;
  targetAudience: string;
  defaultCategories: string[];
  defaultPlatforms: string[];
}

export interface AudienceDemographics {
  ageRange: { range: string; percentage: number }[]; // e.g., [{ range: "18-24", percentage: 30 }, ...]
  genderSplit: { gender: string; percentage: number }[]; // e.g., [{ gender: "Female", percentage: 60 }, ...]
  topLocations: { location: string; percentage: number }[]; // e.g., [{ location: "New York, USA", percentage: 25 }, ...]
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  growthRate: number; // percentage
}

export interface Influencer {
  id: string;
  name: string;
  platform: SocialPlatform;
  followers: string; // e.g., "1.2M", "500K"
  engagementRate: string; // e.g., "2.5%"
  numericEngagementRate?: number; // For calculations
  numericFollowers?: number; // For calculations
  niche: string;
  bio?: string;
  profilePictureUrl: string;
  audienceDemographics?: AudienceDemographics;
  engagementMetrics?: EngagementMetrics;
  samplePostIdea?: string; // From AI suggestion
  isVerified?: boolean;
  contentExamples?: { type: 'image' | 'video'; url: string; caption?: string }[];
}

export enum SocialPlatform {
  Instagram = "Instagram",
  TikTok = "TikTok",
  YouTube = "YouTube",
  Twitter = "Twitter",
  Facebook = "Facebook",
}

export interface BrandPreferences {
  brandName: string;
  targetAudienceKeywords: string[];
  preferredCategories: string[];
  preferredPlatforms: SocialPlatform[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

export enum Language {
  EN = "en",
  HI = "hi",
  TA = "ta",
  FR = "fr", // French
  NL = "nl", // Dutch
  ES = "es", // Spanish
}

export enum Theme {
  Light = "light",
  Dark = "dark", 
}

export interface MenuItem {
  id: string;
  labelKey: string; // For i18n
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // Changed from (props: React.SVGProps<SVGSVGElement>) => React.ReactNode
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}