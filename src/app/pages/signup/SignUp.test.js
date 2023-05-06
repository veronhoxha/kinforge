import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from './SignUp';

describe('SignUp component', () => {
    
    test('shows SignUp component', () => {
        render(
            <Router>
                <SignUp />
            </Router>
        );
        expect(screen.getByTestId('signup-button')).toBeInTheDocument();
    });
        
    test('input field changes', () => {
        render(
            <Router>
                <SignUp />
            </Router>
        );
        const firstNameInput = screen.getByLabelText(/First Name:/i);
        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        const emailInput = screen.getByLabelText(/Email:/i);
        const passwordInput = screen.getByLabelText(/Enter Password/i);
        const confirmPasswordInput = screen.getByLabelText(/Enter Confirm Password/i);  

        fireEvent.change(firstNameInput, { target: { value: 'Veron' } });
        fireEvent.change(lastNameInput, { target: { value: 'Hoxha' } });
        fireEvent.change(emailInput, { target: { value: 'veronhoxha@yahoo.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Veron?02' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Veron?02' } });

        expect(firstNameInput.value).toBe('Veron');
        expect(lastNameInput.value).toBe('Hoxha');
        expect(emailInput.value).toBe('veronhoxha@yahoo.com');
        expect(passwordInput.value).toBe('Veron?02');
        expect(confirmPasswordInput.value).toBe('Veron?02');
    });

    test('form submission with empty fields', async () => {
        render(
            <Router>
                <SignUp />
            </Router>
        );
        const signUpButton = screen.getByTestId('signup-button');
        fireEvent.click(signUpButton);

        await waitFor(() => {
        expect(screen.getByTestId('errors')).toHaveTextContent('Fill in all fields, please.');
        });
    });

    test('form submission with invalid email', async () => {
        render(
            <Router>
                <SignUp />
            </Router>
        );
        const firstNameInput = screen.getByLabelText(/First Name:/i);
        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        const emailInput = screen.getByLabelText(/Email:/i);
        const passwordInput = screen.getByLabelText(/Enter Password/i);
        const confirmPasswordInput = screen.getByLabelText(/Enter Confirm Password/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        fireEvent.change(firstNameInput, { target: { value: 'Veron' } });
        fireEvent.change(lastNameInput, { target: { value: 'Hoxha' } });
        fireEvent.change(emailInput, { target: { value: 'veron@yahoo' } });
        fireEvent.change(passwordInput, { target: { value: 'Veron?02' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Veron?02' } });
        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByTestId('errors')).toHaveTextContent(/Enter a valid email address, please./i);
        });
    });

    test('form submission with invalid password', async () => {
        render(
            <Router>
                <SignUp />
            </Router>
        );
        const firstNameInput = screen.getByLabelText(/First Name:/i);
        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        const emailInput = screen.getByLabelText(/Email:/i);
        const passwordInput = screen.getByLabelText(/Enter Password/i);
        const confirmPasswordInput = screen.getByLabelText(/Enter Confirm Password/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        fireEvent.change(firstNameInput, { target: { value: 'Veron' } });
        fireEvent.change(lastNameInput, { target: { value: 'Hoxha' } });
        fireEvent.change(emailInput, { target: { value: 'veronhoxha@yahoo.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Veron02' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Veron02' } });
        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByTestId('errors')).toHaveTextContent(/Password must be at least eight characters long with one lower case letter, one upper case letter, one number, and one special character./i);
        });
    });

    test('form submission with mismatched passwords', async () => {
        render(
            <Router>
                <SignUp />
            </Router>
        );
        const firstNameInput = screen.getByLabelText(/First Name:/i);
        const lastNameInput = screen.getByLabelText(/Last Name:/i);
        const emailInput = screen.getByLabelText(/Email:/i);
        const passwordInput = screen.getByLabelText(/Enter Password/i);
        const confirmPasswordInput = screen.getByLabelText(/Enter Confirm Password/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        fireEvent.change(firstNameInput, { target: { value: 'Veron' } });
        fireEvent.change(lastNameInput, { target: { value: 'Hoxha' } });
        fireEvent.change(emailInput, { target: { value: 'veronhoxha@yahoo.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Veron?02' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Veron?01' } });
        fireEvent.click(signUpButton);

        await waitFor(() => {
            expect(screen.getByTestId('errors')).toHaveTextContent(/Passwords do not match./i);
        });
    });

});