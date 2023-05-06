import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';
import '@testing-library/jest-dom';

describe('Footer component', () => {

    test('shows Footer component', () => {
        const { getByText, getByRole } = render(
          <Router>
            <Footer />
          </Router>
        );

        const pageNameElement = getByText('KinForge');
        const rightsElement = getByText(/All Rights Reserved/);

        const facebookIcon = getByRole('link', { name: /Facebook/i });
        const instagramIcon = getByRole('link', { name: /Instagram/i });
        const twitterIcon = getByRole('link', { name: /Twitter/i });

        expect(pageNameElement).toBeInTheDocument();
        expect(rightsElement).toBeInTheDocument();

        expect(facebookIcon).toBeInTheDocument();
        expect(facebookIcon.href).toBe('https://www.facebook.com/');

        expect(instagramIcon).toBeInTheDocument();
        expect(instagramIcon.href).toBe('https://www.instagram.com/');

        expect(twitterIcon).toBeInTheDocument();
        expect(twitterIcon.href).toBe('https://twitter.com/');
      });
  
});
