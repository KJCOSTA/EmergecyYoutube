import fs from 'fs/promises';
import path from 'path';
import type { BrandingConfig } from '@/types';

const BRANDING_FILE = path.join(process.cwd(), 'data', 'branding.json');

/**
 * Get branding configuration
 */
export async function getBrandingConfig(): Promise<BrandingConfig> {
  try {
    const fileContent = await fs.readFile(BRANDING_FILE, 'utf-8');
    return JSON.parse(fileContent) as BrandingConfig;
  } catch (error) {
    console.error('Failed to read branding config:', error);
    // Return default branding if file doesn't exist
    return {
      systemName: 'ORION',
      logoUrl: null,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Update branding configuration
 */
export async function updateBrandingConfig(
  updates: Partial<Omit<BrandingConfig, 'updatedAt'>>
): Promise<BrandingConfig> {
  try {
    const currentConfig = await getBrandingConfig();

    const updatedConfig: BrandingConfig = {
      ...currentConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(BRANDING_FILE, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    return updatedConfig;
  } catch (error) {
    console.error('Failed to update branding config:', error);
    throw error;
  }
}

/**
 * Reset branding to default (ORION)
 */
export async function resetBrandingConfig(): Promise<BrandingConfig> {
  const defaultConfig: BrandingConfig = {
    systemName: 'ORION',
    logoUrl: null,
    updatedAt: new Date().toISOString(),
  };

  try {
    await fs.writeFile(BRANDING_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    return defaultConfig;
  } catch (error) {
    console.error('Failed to reset branding config:', error);
    throw error;
  }
}
