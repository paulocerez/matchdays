import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import scrapeMatchdayData from '@/utils/scraping/barcelonaScraper';
import { generateMatchIdentifier } from '@/db/schema';

describe('Barcelona Scraper', () => {
  it('should scrape match data successfully', async () => {
    const matches = await scrapeMatchdayData();
    
    // Check that we got some matches
    expect(matches).toBeDefined();
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBeGreaterThan(0);
    
    console.log(`Scraped ${matches.length} matches`);
  }, 30000); // 30 second timeout for web scraping

  it('should have valid match structure', async () => {
    const matches = await scrapeMatchdayData();
    
    matches.forEach((match, index) => {
      // Check required fields
      expect(match.datetime).toBeDefined();
      expect(match.match).toBeDefined();
      expect(match.competition).toBeDefined();
      expect(match.matchIdentifier).toBeDefined();
      
      // Check data types
      expect(match.datetime).toBeInstanceOf(Date);
      expect(typeof match.match).toBe('string');
      expect(typeof match.competition).toBe('string');
      expect(typeof match.matchIdentifier).toBe('string');
      
      // Check that datetime is valid
      expect(!isNaN(match.datetime.getTime())).toBe(true);
      
      // Check that match string contains teams
      expect(match.match).toContain(' : ');
      
      // Check that matchIdentifier is properly generated
      const expectedIdentifier = generateMatchIdentifier(match.match, match.datetime);
      expect(match.matchIdentifier).toBe(expectedIdentifier);
      
      console.log(`Match ${index + 1}:`, {
        datetime: match.datetime.toISOString(),
        match: match.match,
        competition: match.competition,
        identifier: match.matchIdentifier
      });
    });
  }, 30000);

  it('should generate unique match identifiers', async () => {
    const matches = await scrapeMatchdayData();
    
    const identifiers = matches.map(match => match.matchIdentifier);
    const uniqueIdentifiers = new Set(identifiers);
    
    // All identifiers should be unique
    expect(uniqueIdentifiers.size).toBe(matches.length);
    
    console.log('All match identifiers are unique ✓');
  }, 30000);

  it('should handle date parsing correctly', async () => {
    const matches = await scrapeMatchdayData();
    
    matches.forEach(match => {
      // Check that dates are in the future (matches should be upcoming)
      const now = new Date();
      expect(match.datetime.getTime()).toBeGreaterThan(now.getTime() - 24 * 60 * 60 * 1000); // Allow matches from yesterday
      
      // Check that dates are reasonable (not too far in the future)
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1); // Max 1 year in future
      expect(match.datetime.getTime()).toBeLessThan(maxFutureDate.getTime());
    });
    
    console.log('All dates are within reasonable range ✓');
  }, 30000);
}); 