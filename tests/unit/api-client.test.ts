import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/lib/api/client';

describe('ApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('makes GET requests with correct URL and search params', async () => {
    const mockResponse = { data: [{ id: '1', name: 'John' }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await apiClient.get('/api/users', { page: 1, limit: 10, search: 'john' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as any).mock.calls[0][0];
    expect(calledUrl).toContain('/api/users');
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('limit=10');
    expect(calledUrl).toContain('search=john');
    expect(result).toEqual(mockResponse);
  });

  it('throws an error on non-ok HTTP status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: 'Validation failed' }),
    } as Response);

    await expect(apiClient.get('/api/users')).rejects.toThrow('Validation failed');
  });

  it('makes POST requests with JSON body', async () => {
    const mockUser = { id: 'usr-1', name: 'Alice', email: 'alice@example.com' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockUser }),
    } as Response);

    const result = await apiClient.post('/api/users', { name: 'Alice', email: 'alice@example.com' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const callArgs = (global.fetch as any).mock.calls[0];
    expect(callArgs[1].method).toBe('POST');
    expect(callArgs[1].body).toBe(JSON.stringify({ name: 'Alice', email: 'alice@example.com' }));
    expect(result).toEqual({ data: mockUser });
  });
});
