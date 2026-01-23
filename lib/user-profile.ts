import fs from 'fs/promises';
import path from 'path';
import type { UserProfile } from '@/types';

const PROFILE_FILE = path.join(process.cwd(), 'data', 'user-profile.json');

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const fileContent = await fs.readFile(PROFILE_FILE, 'utf-8');
    return JSON.parse(fileContent) as UserProfile;
  } catch (error) {
    console.error('Failed to read user profile:', error);
    // Return default profile if file doesn't exist
    return {
      id: 'admin-001',
      name: 'Admin',
      role: 'System Administrator',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      bio: 'ORION System Administrator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>
): Promise<UserProfile> {
  try {
    const currentProfile = await getUserProfile();

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(PROFILE_FILE, JSON.stringify(updatedProfile, null, 2), 'utf-8');

    return updatedProfile;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}
