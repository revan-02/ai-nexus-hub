import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '@/components/layout/sidebar';

describe('Sidebar', () => {
  it('renders the logo text', () => {
    render(<Sidebar />);
    expect(screen.getByText('AI KNOWLEDGE HUB')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI Architecture')).toBeInTheDocument();
  });
});
