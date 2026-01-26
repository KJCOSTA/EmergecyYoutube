import { PrismaClient } from '@prisma/client';
import type { UserProfile } from '@/types';

const prisma = new PrismaClient();

const defaultProfile = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@orion.com',
  role: 'System Administrator',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  bio: 'ORION System Administrator',
};

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    let profile = await prisma.userProfile.findUnique({
      where: { id: 'admin-001' },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: defaultProfile,
      });
    }

    return {
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to read user profile from database:', error);
    return {
      ...defaultProfile,
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
    const { name, email, role, avatarUrl, bio } = updates;

    const updatedProfile = await prisma.userProfile.upsert({
      where: { id: 'admin-001' },
      update: {
        name,
        email,
        role,
        avatarUrl,
        bio,
      },
      create: {
        ...defaultProfile,
        ...updates,
      },
    });

    return {
      ...updatedProfile,
      createdAt: updatedProfile.createdAt.toISOString(),
      updatedAt: updatedProfile.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to update user profile in database:', error);
    throw error;
  }
}
