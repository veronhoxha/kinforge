import React from 'react';
import { render, screen } from '@testing-library/react';
import Help from './Help';
import '@testing-library/jest-dom';
jest.mock('../../../../Authentication');

describe('Help component', () => {

    test('shows Help component', () => {
        render(
          <Help />
        );
        const helpHeading = screen.getByRole('heading', { level: 2, name: /Help/i });
        expect(helpHeading).toBeInTheDocument();
    });

    test('shows all expected headings', () => {
        render(
          <Help />
        );
        
        const headings = [
          'Help',
          'Adding Family Members',
          'Editing and Deleting Family Members',
          'Viewing and Navigating the Tree',
          'Exporting family tree as PNG',
          'Contact Us'
        ];

        headings.forEach(heading => {
          expect(screen.getByText(heading)).toBeInTheDocument();
        });
    });

    test('shows support email', () => {
        render(
          <Help />
        );
        const supportEmail = screen.getByText(/support@kinforge.com/i);
        expect(supportEmail).toBeInTheDocument();
    });

    test('shows help-wrapper class', () => {
        render(
          <Help />
        );
        const helpWrapper = screen.getByTestId('help-wrapper');
        expect(helpWrapper).toBeInTheDocument();
      });

});