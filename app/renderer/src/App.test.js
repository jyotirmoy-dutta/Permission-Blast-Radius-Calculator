import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Permission Blast Radius Calculator and selects a user', () => {
  render(<App />);
  expect(screen.getByText(/Permission Blast Radius Calculator/i)).toBeInTheDocument();
  const select = screen.getByLabelText(/Select User/i);
  fireEvent.change(select, { target: { value: 'alice' } });
  expect(screen.getByText(/Blast Radius for alice/i)).toBeInTheDocument();
});
