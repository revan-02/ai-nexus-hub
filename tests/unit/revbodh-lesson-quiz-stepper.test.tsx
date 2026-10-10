import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RevBodhLessonQuiz } from '@/components/learning/revbodh-lesson-quiz';
import { RevBodhQuizQuestion } from '@/types/revbodh-course';

const sampleQuestions: RevBodhQuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Which keyword creates a function in Python?',
    type: 'MULTIPLE_CHOICE',
    options: ['function', 'def', 'create', 'func'],
    correctAnswerIndex: 1,
    explanation: 'The def keyword defines a function header in Python.',
  },
  {
    id: 'q-2',
    question: 'Are Python strings mutable?',
    type: 'TRUE_FALSE',
    options: ['Yes', 'No'],
    correctAnswerIndex: 1,
    explanation: 'Python strings are strictly immutable.',
  },
];

describe('RevBodhLessonQuiz 1-Question-at-a-Time Stepper', () => {
  it('renders Question 1 initially with disabled Submit Answer button until option is chosen', () => {
    render(<RevBodhLessonQuiz questions={sampleQuestions} />);

    expect(screen.getByText(/Question 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByText('Which keyword creates a function in Python?')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /submit answer/i });
    expect(submitBtn).toBeDisabled();
  });

  it('allows selecting an option, submits answer, shows instant feedback, and advances to next question', () => {
    const handleComplete = vi.fn();
    render(<RevBodhLessonQuiz questions={sampleQuestions} onComplete={handleComplete} />);

    // Select Option B ("def")
    const optionB = screen.getByText('def');
    fireEvent.click(optionB);

    const submitBtn = screen.getByRole('button', { name: /submit answer/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    // Feedback should appear
    expect(screen.getByText(/Correct! Well done./i)).toBeInTheDocument();
    expect(screen.getByText(/The def keyword defines a function/i)).toBeInTheDocument();

    // Next Question button appears
    const nextBtn = screen.getByRole('button', { name: /next question/i });
    fireEvent.click(nextBtn);

    // Question 2 should now be visible
    expect(screen.getByText(/Question 2 of 2/i)).toBeInTheDocument();
    expect(screen.getByText('Are Python strings mutable?')).toBeInTheDocument();
  });

  it('completes quiz on answering last question and shows final score screen', () => {
    const handleComplete = vi.fn();
    const handleContinue = vi.fn();
    render(
      <RevBodhLessonQuiz
        questions={sampleQuestions}
        onComplete={handleComplete}
        onContinueNextLesson={handleContinue}
      />
    );

    // Answer Q1 correctly
    fireEvent.click(screen.getByText('def'));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));

    // Answer Q2 correctly ("No")
    fireEvent.click(screen.getByText('No'));
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    const completeBtn = screen.getByRole('button', { name: /complete quiz & view score/i });
    fireEvent.click(completeBtn);

    // Score screen should render
    expect(screen.getByText(/Congratulations! You Passed/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(handleComplete).toHaveBeenCalledWith(2, 2);

    // Continue to Next Lesson button
    const continueBtn = screen.getByRole('button', { name: /continue to next lesson/i });
    fireEvent.click(continueBtn);
    expect(handleContinue).toHaveBeenCalledTimes(1);
  });
});
