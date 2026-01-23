import fs from 'fs/promises';
import path from 'path';
import type { SystemLog, LogLevel, LogSource, LogsData } from '@/types';

const LOGS_FILE = path.join(process.cwd(), 'data', 'system-logs.json');

/**
 * Utility function to log system events
 * This function writes to the system-logs.json file
 */
export async function logSystemEvent(
  level: LogLevel,
  source: LogSource,
  message: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    // Read existing logs
    const fileContent = await fs.readFile(LOGS_FILE, 'utf-8');
    const logsData: LogsData = JSON.parse(fileContent);

    // Create new log entry
    const newLog: SystemLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      details,
    };

    // Add to logs array (prepend to show newest first)
    logsData.logs.unshift(newLog);

    // Keep only last 1000 logs to prevent file from growing too large
    if (logsData.logs.length > 1000) {
      logsData.logs = logsData.logs.slice(0, 1000);
    }

    // Write back to file
    await fs.writeFile(LOGS_FILE, JSON.stringify(logsData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write system log:', error);
    // Don't throw - logging should never break the application
  }
}

/**
 * Read all system logs
 */
export async function getSystemLogs(limit?: number): Promise<SystemLog[]> {
  try {
    const fileContent = await fs.readFile(LOGS_FILE, 'utf-8');
    const logsData: LogsData = JSON.parse(fileContent);

    if (limit) {
      return logsData.logs.slice(0, limit);
    }

    return logsData.logs;
  } catch (error) {
    console.error('Failed to read system logs:', error);
    return [];
  }
}

/**
 * Clear all system logs
 */
export async function clearSystemLogs(): Promise<void> {
  try {
    const logsData: LogsData = { logs: [] };
    await fs.writeFile(LOGS_FILE, JSON.stringify(logsData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to clear system logs:', error);
    throw error;
  }
}

/**
 * Search logs by text
 */
export async function searchLogs(query: string): Promise<SystemLog[]> {
  try {
    const logs = await getSystemLogs();
    const lowerQuery = query.toLowerCase();

    return logs.filter(log =>
      log.message.toLowerCase().includes(lowerQuery) ||
      log.source.toLowerCase().includes(lowerQuery) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Failed to search logs:', error);
    return [];
  }
}

/**
 * Get logs by level
 */
export async function getLogsByLevel(level: LogLevel): Promise<SystemLog[]> {
  try {
    const logs = await getSystemLogs();
    return logs.filter(log => log.level === level);
  } catch (error) {
    console.error('Failed to get logs by level:', error);
    return [];
  }
}

/**
 * Get logs by source
 */
export async function getLogsBySource(source: LogSource): Promise<SystemLog[]> {
  try {
    const logs = await getSystemLogs();
    return logs.filter(log => log.source === source);
  } catch (error) {
    console.error('Failed to get logs by source:', error);
    return [];
  }
}
