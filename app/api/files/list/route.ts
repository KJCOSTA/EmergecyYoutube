import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import type { DirectoryListing, FileEntry } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/files/list
 * Lists files from Vercel Blob storage
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get('path') || '';

    // List blobs with optional prefix (folder simulation)
    const { blobs } = await list({
      prefix: prefix ? `${prefix}/` : undefined,
      limit: 1000,
    });

    // Transform blobs into file entries
    const fileEntries: FileEntry[] = blobs.map((blob) => {
      // Extract filename from pathname
      const pathParts = blob.pathname.split('/');
      const name = pathParts[pathParts.length - 1];

      return {
        name,
        path: blob.pathname,
        type: 'file' as const,
        size: blob.size,
        modifiedAt: blob.uploadedAt.toISOString(),
        url: blob.url,
      };
    });

    // Group by folders to simulate directory structure
    const folders = new Set<string>();
    fileEntries.forEach((entry) => {
      const parts = entry.path.split('/');
      if (parts.length > 1) {
        // Add parent folders
        for (let i = 1; i < parts.length; i++) {
          const folderPath = parts.slice(0, i).join('/');
          if (folderPath && !prefix.startsWith(folderPath)) {
            folders.add(folderPath);
          }
        }
      }
    });

    // Filter entries based on current path
    let filteredEntries = fileEntries;
    if (prefix) {
      // Only show files directly in this "folder"
      filteredEntries = fileEntries.filter((entry) => {
        const relativePath = entry.path.replace(`${prefix}/`, '');
        return entry.path.startsWith(`${prefix}/`) && !relativePath.includes('/');
      });
    } else {
      // At root, show only top-level files and folders
      const topLevelFolders = new Set<string>();
      fileEntries.forEach((entry) => {
        const parts = entry.path.split('/');
        if (parts.length > 1) {
          topLevelFolders.add(parts[0]);
        }
      });

      // Add folder entries
      const folderEntries: FileEntry[] = Array.from(topLevelFolders).map((folder) => ({
        name: folder,
        path: folder,
        type: 'directory' as const,
        modifiedAt: new Date().toISOString(),
      }));

      // Keep only top-level files
      filteredEntries = fileEntries.filter((entry) => !entry.path.includes('/'));
      filteredEntries = [...folderEntries, ...filteredEntries];
    }

    // Sort: directories first, then alphabetically
    filteredEntries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    const response: DirectoryListing = {
      path: prefix,
      entries: filteredEntries,
      totalSize: blobs.reduce((acc, blob) => acc + blob.size, 0),
      totalFiles: blobs.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to list files:', error);

    // If Vercel Blob is not configured, return empty list with message
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json({
        path: '',
        entries: [],
        totalSize: 0,
        totalFiles: 0,
        message: 'Vercel Blob not configured. Add BLOB_READ_WRITE_TOKEN to environment variables.',
      });
    }

    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
