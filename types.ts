import React from 'react';

export enum View {
  Dashboard = 'DASHBOARD',
  CheckIn = 'CHECKIN',
  Insights = 'INSIGHTS',
  Profile = 'PROFILE',
  Login = 'LOGIN',
  Terms = 'TERMS',
  Contact = 'CONTACT',
}

// FIX: Add Goal interface for use in Goals and LogGoalFlow components.
export interface Goal {
  id: string;
  title: string;
  description: string;
  active: boolean;
  isCustom: boolean;
}

export interface CheckInData {
  sleepQuality: number;
  energyLevel: number;
  muscleSoreness: number;
  stressLevel: number;
  mood: number;
  focus: number;
  motivation: number;
  tss: number;
  factors: string[];
}

export interface CheckInRecord {
  id: string; // ISO timestamp
  data: CheckInData;
  recoveryScore: number;
}

export interface Factor {
  id: string; // factor_key
  name: string;
  weight: number;
  tau: number;
  // FIX: Add optional 'active' property to fix type error in Factors.tsx.
  active?: boolean;
}