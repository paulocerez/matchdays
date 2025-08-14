/**
 * Initialize and start the scheduler when the application starts
 */

import { scheduleScraping } from './scheduler';

let scheduler: ReturnType<typeof scheduleScraping> | null = null;

export function startScheduler() {
  if (scheduler) {
    console.log('Scheduler already running');
    return scheduler;
  }
  
  console.log('🚀 Starting match scraping scheduler...');
  scheduler = scheduleScraping();
  
  // Log when the scheduler will next run
  if (scheduler) {
    console.log('✅ Scheduler started successfully');
    console.log(`📅 Next run: ${scheduler.nextRun()}`);
  }
  
  return scheduler;
}

export function stopScheduler() {
  if (scheduler) {
    console.log('🛑 Stopping match scraping scheduler...');
    scheduler.stop();
    scheduler = null;
    console.log('✅ Scheduler stopped');
  }
}

export function getScheduler() {
  return scheduler;
} 