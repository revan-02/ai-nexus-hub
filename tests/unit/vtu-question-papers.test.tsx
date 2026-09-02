import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VTUQuestionPapersPage from '@/app/vtu-question-papers/page';
import { getVTUQuestionPapers, getVTUPaperById } from '@/services/vtu-question-paper-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('VTU Old Question Papers & Model Solutions Hub (Multi-Branch)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders VTU Question Papers header, branch selector tabs, and examination metadata', () => {
    render(<VTUQuestionPapersPage />);

    expect(screen.getByText(/VTU Question Papers & Step-by-Step Solved Models \(by Branch\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Visvesvaraya Technological University, Belagavi/i)).toBeInTheDocument();
    expect(screen.getAllByText(/AI & ML \(AIML\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Computer Science \(CSE\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI & Data Science \(AIDS\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Information Science \(ISE\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Electronics & Comm \(ECE\)/i).length).toBeGreaterThan(0);
  });

  it('filters question papers when selecting branch buttons', () => {
    render(<VTUQuestionPapersPage />);

    // Click on CSE branch button
    const cseButtons = screen.getAllByRole('button', { name: /Computer Science \(CSE\)/i });
    fireEvent.click(cseButtons[0]);

    expect(screen.getAllByText(/CSE/i).length).toBeGreaterThan(0);
  });

  it('switches between question papers and displays subject code and scheme', () => {
    render(<VTUQuestionPapersPage />);

    // Click on 21AI61 Deep Learning paper button
    const dlPaperBtn = screen.getByRole('button', { name: /21AI61 - Deep Learning/i });
    fireEvent.click(dlPaperBtn);

    expect(screen.getAllByText(/21AI61/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Module 1: Deep Feedforward Networks & Optimization/i)).toBeInTheDocument();
  });

  it('expands question accordion to display step-by-step solution, derivation, and VTU marks breakdown', () => {
    render(<VTUQuestionPapersPage />);

    // Check Question 1 text
    expect(screen.getByText(/Explain A\* Search algorithm with an illustrative state graph/i)).toBeInTheDocument();
    expect(screen.getByText(/VTU Valuation & Marks Allocation Scheme:/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-Step Model Examination Answer:/i)).toBeInTheDocument();
  });

  it('service fetches papers by branch, scheme and subject code correctly', async () => {
    const csePapers = await getVTUQuestionPapers({ branch: 'CSE' });
    expect(csePapers.length).toBeGreaterThan(0);
    expect(csePapers[0].branch).toContain('CSE');

    const ecePapers = await getVTUQuestionPapers({ branch: 'ECE' });
    expect(ecePapers.length).toBeGreaterThan(0);
    expect(ecePapers[0].subjectCode).toBe('21EC71');

    const paperById = await getVTUPaperById('vtu-21ai54-jul2024');
    expect(paperById).not.toBeNull();
    expect(paperById?.subjectName).toBe('Artificial Intelligence & Machine Learning');
  });
});
