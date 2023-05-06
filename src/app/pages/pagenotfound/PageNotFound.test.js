import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import PageNotFound from './PageNotFound';

describe('PageNotFound component', () => {

    test('shows PageNotFound component without crashing', () => {
        render(
          <Router>
            <PageNotFound />
          </Router>
        );
    });

    test('displays "Oops! Page was not found." message', () => {
        render(
          <Router>
            <PageNotFound />
          </Router>
        );
        expect(screen.getByText(/Oops! Page was not found./i)).toBeInTheDocument();
    });

    test('displays "404" error code', () => {
        render(
          <Router>
            <PageNotFound />
          </Router>
        );
        expect(screen.getByText(/404/i)).toBeInTheDocument();
    });

    test('"Go back home" button is present and clickable', () => {
        render(
          <Router>
            <PageNotFound />
          </Router>
        );
        const goBackHomeButton = screen.getByRole('button', { name: /go back home/i });
        expect(goBackHomeButton).toBeInTheDocument();
    });

    test('"Go back home" button navigates to the homepage', () => {
        render(
          <Router>
            <PageNotFound />
          </Router>
        );
        const goBackHomeButtonLink = screen.getByRole('link', { name: /go back home/i });
        expect(goBackHomeButtonLink.closest('a')).toHaveAttribute('href', '/');
    });

});