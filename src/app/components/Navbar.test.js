import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
    process.env.PUBLIC_URL = '/';
  });
  
afterAll(() => {
    process.env.PUBLIC_URL = undefined;
});
  
describe('Navbar component', () => {

    test('shows the Navbar component', () => {
        render(
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        );
        const navbarElement = screen.getByRole('navigation');
        expect(navbarElement).toBeInTheDocument();
    });

    test('contains the logo image with correct source', () => {
        render(
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        );
        const logoElement = screen.getByAltText('Logo');
        expect(logoElement).toHaveAttribute('src', '/favicon.ico');
    });

    test('contains the Log In button', () => {
        render(
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        );
        const loginButton = screen.getByRole('button', { name: 'Log In' });
        expect(loginButton).toBeInTheDocument();
    });

    test('contains the Sign Up button', () => {
        render(
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        );
        const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
        expect(signUpButton).toBeInTheDocument();
    });

    test('contains the menu open button', () => {
        render(
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        );
        const menuOpenButton = screen.getByLabelText('Open menu');
        expect(menuOpenButton).toBeInTheDocument();
    });

    test('contains the menu close button', () => {
        render(
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        );
        const menuCloseButton = screen.getByLabelText('Close menu');
        expect(menuCloseButton).toBeInTheDocument();
    });

});