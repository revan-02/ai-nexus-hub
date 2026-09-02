import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoryManager } from '@/components/categories/category-manager';
import { GET, POST, DELETE } from '@/app/api/categories/route';
import { NextRequest } from 'next/server';

describe('Categories & Child Categories Taxonomy Management', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders CategoryManager with parent and child categories', () => {
    render(<CategoryManager />);

    expect(screen.getByText(/Categories & Sub-Taxonomy Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Artificial Intelligence & Machine Learning/i)).toBeInTheDocument();
    expect(screen.getByText(/Generative AI & Large Language Models/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Neural Networks & Backpropagation/i)).toBeInTheDocument();
    expect(screen.getByText(/New Main Category/i)).toBeInTheDocument();
    expect(screen.getByText(/New Child Sub-Category/i)).toBeInTheDocument();
  });

  it('filters category tree by search query', () => {
    render(<CategoryManager />);

    const searchInput = screen.getByPlaceholderText(/Search categories, sub-categories, slugs/i);
    fireEvent.change(searchInput, { target: { value: 'FlashAttention' } });

    expect(screen.getByText(/Generative AI & Large Language Models/i)).toBeInTheDocument();
  });

  it('opens Parent Category modal and creates a main category', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            id: 'cat-999',
            name: 'Quantum Machine Learning',
            slug: 'quantum-machine-learning',
            description: 'Quantum circuits and variational algorithms',
            icon: 'Cpu',
            color: '#8b5cf6',
            courseCount: 0,
            articleCount: 0,
            status: 'Active',
            children: [],
            createdAt: 'Aug 31, 2026',
          },
        }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<CategoryManager />);

    const createBtn = screen.getByRole('button', { name: /New Main Category/i });
    fireEvent.click(createBtn);

    expect(screen.getByText(/Create Main Parent Category/i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Quantum Computing & AI/i);
    fireEvent.change(nameInput, { target: { value: 'Quantum Machine Learning' } });

    const submitBtn = screen.getByRole('button', { name: /^Create Category$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/created successfully/i)).toBeInTheDocument();
    });
  });

  it('opens Child Sub-Category modal and adds a sub-category', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            id: 'sub-888',
            name: 'Graph Neural Networks',
            slug: 'graph-neural-networks',
            description: 'Message passing graph networks',
            parentId: 'cat-1',
            parentName: 'Artificial Intelligence & Machine Learning',
            courseCount: 0,
            articleCount: 0,
            icon: 'Tag',
            color: '#8b5cf6',
            status: 'Active',
            createdAt: 'Aug 31, 2026',
          },
        }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<CategoryManager />);

    const createChildBtn = screen.getByRole('button', { name: /New Child Sub-Category/i });
    fireEvent.click(createChildBtn);

    expect(screen.getByText(/Create Child Sub-Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Parent Category/i)).toBeInTheDocument();

    const childNameInput = screen.getByPlaceholderText(/e\.g\. GraphRAG & Vector Embeddings/i);
    fireEvent.change(childNameInput, { target: { value: 'Graph Neural Networks' } });

    const submitChildBtn = screen.getByRole('button', { name: /Create Sub-Category/i });
    fireEvent.click(submitChildBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/added successfully/i)).toBeInTheDocument();
    });
  });

  it('API: GET, POST (parent and child) and DELETE', async () => {
    // 1. GET
    const getRes = await GET(new NextRequest('http://localhost:3000/api/categories'));
    const getJson = await getRes.json();
    expect(getJson.success).toBe(true);
    expect(getJson.data.categories.length).toBeGreaterThan(0);

    // 2. POST Parent
    const postParentReq = new NextRequest('http://localhost:3000/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Cybersecurity AI & Threat Intelligence',
        description: 'SOC automation and adversarial AI',
      }),
    });
    const parentRes = await POST(postParentReq);
    const parentJson = await parentRes.json();
    expect(parentJson.success).toBe(true);
    expect(parentJson.data.name).toBe('Cybersecurity AI & Threat Intelligence');

    // 3. POST Child under newly created parent
    const postChildReq = new NextRequest('http://localhost:3000/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Adversarial Prompt Injection Defense',
        parentId: parentJson.data.id,
      }),
    });
    const childRes = await POST(postChildReq);
    const childJson = await childRes.json();
    expect(childJson.success).toBe(true);
    expect(childJson.data.name).toBe('Adversarial Prompt Injection Defense');

    // 4. DELETE
    const deleteReq = new NextRequest(`http://localhost:3000/api/categories?id=${parentJson.data.id}`, {
      method: 'DELETE',
    });
    const deleteRes = await DELETE(deleteReq);
    const deleteJson = await deleteRes.json();
    expect(deleteJson.success).toBe(true);
  });
});
