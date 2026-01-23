import fs from 'fs/promises';
import path from 'path';
import type { DocPage, DocsData, DocCategory } from '@/types';

const DOCS_FILE = path.join(process.cwd(), 'data', 'docs-content.json');

/**
 * Get all documentation pages
 */
export async function getAllDocs(): Promise<DocsData> {
  try {
    const fileContent = await fs.readFile(DOCS_FILE, 'utf-8');
    return JSON.parse(fileContent) as DocsData;
  } catch (error) {
    console.error('Failed to read docs:', error);
    return {
      pages: [],
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Get a specific doc page by ID
 */
export async function getDocById(id: string): Promise<DocPage | null> {
  try {
    const docsData = await getAllDocs();
    return docsData.pages.find(page => page.id === id) || null;
  } catch (error) {
    console.error('Failed to get doc by ID:', error);
    return null;
  }
}

/**
 * Get docs by category
 */
export async function getDocsByCategory(category: DocCategory): Promise<DocPage[]> {
  try {
    const docsData = await getAllDocs();
    return docsData.pages
      .filter(page => page.category === category)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Failed to get docs by category:', error);
    return [];
  }
}

/**
 * Get visible docs only
 */
export async function getVisibleDocs(): Promise<DocPage[]> {
  try {
    const docsData = await getAllDocs();
    return docsData.pages.filter(page => page.visible);
  } catch (error) {
    console.error('Failed to get visible docs:', error);
    return [];
  }
}

/**
 * Create a new doc page
 */
export async function createDoc(
  doc: Omit<DocPage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DocPage> {
  try {
    const docsData = await getAllDocs();

    const newDoc: DocPage = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    docsData.pages.push(newDoc);
    docsData.updatedAt = new Date().toISOString();

    await fs.writeFile(DOCS_FILE, JSON.stringify(docsData, null, 2), 'utf-8');

    return newDoc;
  } catch (error) {
    console.error('Failed to create doc:', error);
    throw error;
  }
}

/**
 * Update an existing doc page
 */
export async function updateDoc(
  id: string,
  updates: Partial<Omit<DocPage, 'id' | 'createdAt'>>
): Promise<DocPage | null> {
  try {
    const docsData = await getAllDocs();
    const docIndex = docsData.pages.findIndex(page => page.id === id);

    if (docIndex === -1) {
      return null;
    }

    const updatedDoc: DocPage = {
      ...docsData.pages[docIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    docsData.pages[docIndex] = updatedDoc;
    docsData.updatedAt = new Date().toISOString();

    await fs.writeFile(DOCS_FILE, JSON.stringify(docsData, null, 2), 'utf-8');

    return updatedDoc;
  } catch (error) {
    console.error('Failed to update doc:', error);
    throw error;
  }
}

/**
 * Delete a doc page
 */
export async function deleteDoc(id: string): Promise<boolean> {
  try {
    const docsData = await getAllDocs();
    const filteredPages = docsData.pages.filter(page => page.id !== id);

    if (filteredPages.length === docsData.pages.length) {
      return false; // Doc not found
    }

    docsData.pages = filteredPages;
    docsData.updatedAt = new Date().toISOString();

    await fs.writeFile(DOCS_FILE, JSON.stringify(docsData, null, 2), 'utf-8');

    return true;
  } catch (error) {
    console.error('Failed to delete doc:', error);
    throw error;
  }
}

/**
 * Reorder docs
 */
export async function reorderDocs(docIds: string[]): Promise<void> {
  try {
    const docsData = await getAllDocs();

    // Update order for each doc
    docIds.forEach((id, index) => {
      const doc = docsData.pages.find(page => page.id === id);
      if (doc) {
        doc.order = index + 1;
        doc.updatedAt = new Date().toISOString();
      }
    });

    docsData.updatedAt = new Date().toISOString();

    await fs.writeFile(DOCS_FILE, JSON.stringify(docsData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to reorder docs:', error);
    throw error;
  }
}
