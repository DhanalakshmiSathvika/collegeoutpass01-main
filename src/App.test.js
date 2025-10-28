import { render, screen } from '@testing-library/react';
import App from './App';

test('renders College Outpass System landing page', () => {
  render(<App />);
  
  // Check heading visibility
  const titleElement = screen.getByText(/College Outpass System/i);
  expect(titleElement).toBeInTheDocument();

  // Check subtitle
  const subtitleElement = screen.getByText(/Manage campus exit permissions efficiently/i);
  expect(subtitleElement).toBeInTheDocument();

  // Check role cards
  const studentRole = screen.getByText(/Student/i);
  expect(studentRole).toBeInTheDocument();

  const hodRole = screen.getByText(/HOD \/ Management/i);
  expect(hodRole).toBeInTheDocument();

  const securityRole = screen.getByText(/Security/i);
  expect(securityRole).toBeInTheDocument();
});

test('has navigation links to role login pages', () => {
  render(<App />);
  
  // Ensure clickable text exists
  expect(screen.getByText(/Student/i)).toBeInTheDocument();
  expect(screen.getByText(/HOD \/ Management/i)).toBeInTheDocument();
  expect(screen.getByText(/Security/i)).toBeInTheDocument();
});
