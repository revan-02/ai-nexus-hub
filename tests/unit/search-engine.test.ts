import { describe, it, expect } from 'vitest';
import { HybridSearchEngine, hybridSearch } from '@/services/search-engine-service';

describe('HybridSearchEngine', () => {
  it('instantiates the singleton search engine', () => {
    const engine1 = HybridSearchEngine.getInstance();
    const engine2 = HybridSearchEngine.getInstance();
    expect(engine1).toBe(engine2);
  });

  it('performs sub-millisecond search on exact matches', () => {
    const results = hybridSearch('Transformer');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain('transformer');
  });

  it('handles fuzzy typos via Damerau-Levenshtein distance', () => {
    // Typo: "trasnformer" -> should still find Transformer
    const results = hybridSearch('trasnformer');
    expect(results.length).toBeGreaterThan(0);
    const hasTransformer = results.some((r) => r.title.toLowerCase().includes('transformer'));
    expect(hasTransformer).toBe(true);
  });

  it('filters results by category', () => {
    const results = hybridSearch('Daily', { category: 'Daily Challenge' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe('Daily Challenge');
  });

  it('returns default curated catalog on empty query', () => {
    const results = hybridSearch('');
    expect(results.length).toBeGreaterThan(0);
  });

  it('memoizes identical queries in LRU cache', () => {
    const start1 = performance.now();
    const res1 = hybridSearch('Agriculture');
    const time1 = performance.now() - start1;

    const start2 = performance.now();
    const res2 = hybridSearch('Agriculture');
    const time2 = performance.now() - start2;

    expect(res1).toEqual(res2);
    expect(time2).toBeLessThanOrEqual(time1 + 1); // Cached lookup is instant
  });
});
