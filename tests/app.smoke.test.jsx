import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from '../src/App';

describe('App', () => {
  test('renders the main scheduler sections', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /cpu scheduler visualizer/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /algorithm selector/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /process table/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /gantt chart/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /per-process metrics/i })).toBeInTheDocument();
  });

  test('shows the time quantum input only for round robin', () => {
    render(<App />);

    expect(screen.queryByLabelText(/time quantum/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /round robin/i }));
    expect(screen.getByLabelText(/time quantum/i)).toBeInTheDocument();
  });

  test('renders preset names and allows editing process rows', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /internship rush/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /campus lab demo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deadline sprint/i })).toBeInTheDocument();

    const processInput = screen.getByLabelText(/process id 1/i);
    fireEvent.change(processInput, { target: { value: 'A1' } });
    expect(screen.getByDisplayValue('A1')).toBeInTheDocument();
  });
});
