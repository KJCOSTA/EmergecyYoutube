import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { DirectoryListing, FileEntry } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/files/list
 * Lists files in the data directory recursively
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const relativePath = searchParams.get('path') || '';

    // Base directory - data folder
    const baseDir = path.join(process.cwd(), 'data');
    const targetDir = path.join(baseDir, relativePath);

    // Security: prevent path traversal attacks
    if (!targetDir.startsWith(baseDir)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 403 }
      );
    }

    // Check if directory exists
    try {
      const stats = await fs.stat(targetDir);
      if (!stats.isDirectory()) {
        return NextResponse.json(
          { error: 'Path is not a directory' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Directory not found' },
        { status: 404 }
      );
    }

    // Read directory contents
    const entries = await fs.readdir(targetDir, { withFileTypes: true });

    const fileEntries: FileEntry[] = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(targetDir, entry.name);
        const stats = await fs.stat(fullPath);
        const relativeTo = path.relative(baseDir, fullPath);

        return {
          name: entry.name,
          path: relativeTo,
          type: entry.isDirectory() ? 'directory' : 'file',
          size: entry.isFile() ? stats.size : undefined,
          modifiedAt: stats.mtime.toISOString(),
        };
      })
    );

    // Sort: directories first, then alphabetically
    fileEntries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    const response: DirectoryListing = {
      path: relativePath,
      entries: fileEntries,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to list files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
