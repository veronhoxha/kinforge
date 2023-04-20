import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import Login from './login';

jest.mock('firebase/auth');

test('renders Login component without crashing', () => {
    render(
        <Router>
        <Login />
        </Router>
    );
});

test('initial state is set correctly', () => {
    render(
        <Router>
        <Login />
        </Router>
    );
    expect(screen.getByLabelText(/email/i).value).toBe('');
    expect(screen.getByLabelText(/password/i).value).toBe('');
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
});

test('email input field accepts text input', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'veronhoxha@yahoo.com' } });
    expect(emailInput.value).toBe('veronhoxha@yahoo.com');
});

test('password input field accepts text input', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'Password?02' } });
    expect(passwordInput.value).toBe('Password?02');
});

test('login button is present and clickable', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
});

test('"Forgot your password?" link is present and clickable', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const forgotPasswordLink = screen.getByText(/forgot your password/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    fireEvent.click(forgotPasswordLink);
});

test('"You don\'t have an account already?" link is present and navigates to the signup page', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const signupLink = screen.getByText(/you don't have an account already/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
});

test('error is displayed if both email and password are empty when the login button is clicked', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    await waitFor(() => expect(screen.getByText(/enter your email address and password/i)).toBeInTheDocument());
});

test('error is displayed if the email is empty when the login button is clicked', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'Password?02' } });
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    await waitFor(() => expect(screen.getByText(/enter your email address/i)).toBeInTheDocument());
});

test('error is displayed if the password is empty when the login button is clicked', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'veronhoxha@yahoo.com' } });
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    await waitFor(() => expect(screen.getByText(/enter your password/i)).toBeInTheDocument());
});

test('displays error if no email is entered when clicking "Forgot your password?" link', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const forgotPasswordLink = screen.getByText(/forgot your password/i);
    fireEvent.click(forgotPasswordLink);
  
    await waitFor(() => expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument());
});
  
test('sends password reset email when "Forgot your password?" link is clicked', async () => {
    sendPasswordResetEmail.mockResolvedValue();
  
    render(
      <Router>
        <Login />
      </Router>
    );
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'veronhoxha@yahoo.com' } });
    const forgotPasswordLink = screen.getByText(/forgot your password/i);
    fireEvent.click(forgotPasswordLink);
  
    await waitFor(() => expect(screen.getByText(/password reset email sent to/i)).toBeInTheDocument());
});
