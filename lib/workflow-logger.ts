/**
 * Workflow Logger - Integration helper for adding logs to the workflow
 * 
 * This file provides convenient functions to log workflow events
 */

import { addLog } from '@/app/actions/settings';
import type { LogLevel } from '@/types';

export async function logWorkflowStep(step: string, action: string, details?: Record<string, unknown>) {
  try {
    await addLog('info', 'workflow', `${step}: ${action}`, details);
  } catch (error) {
    console.error('Failed to log workflow step:', error);
  }
}

export async function logWorkflowSuccess(step: string, message: string, details?: Record<string, unknown>) {
  try {
    await addLog('success', 'workflow', `${step}: ${message}`, details);
  } catch (error) {
    console.error('Failed to log workflow success:', error);
  }
}

export async function logWorkflowError(step: string, error: string | Error, details?: Record<string, unknown>) {
  try {
    const errorMessage = error instanceof Error ? error.message : error;
    await addLog('error', 'workflow', `${step}: ${errorMessage}`, details);
  } catch (err) {
    console.error('Failed to log workflow error:', err);
  }
}

export async function logAPICall(apiName: string, action: string, success: boolean, details?: Record<string, unknown>) {
  try {
    const level: LogLevel = success ? 'success' : 'error';
    await addLog(level, 'api', `${apiName}: ${action}`, details);
  } catch (error) {
    console.error('Failed to log API call:', error);
  }
}

export async function logUserAction(action: string, details?: Record<string, unknown>) {
  try {
    await addLog('info', 'user', action, details);
  } catch (error) {
    console.error('Failed to log user action:', error);
  }
}
