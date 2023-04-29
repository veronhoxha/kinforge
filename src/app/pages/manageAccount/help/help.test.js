import React from 'react';
import { render, screen } from '@testing-library/react';
import Help from './help';
import '@testing-library/jest-dom';
jest.mock('../../../../Authentication');

describe('Help', () => {

  test('renders Help component', () => {
    render(
      <Help />
    );
    const helpHeading = screen.getByRole('heading', { level: 2, name: /Help/i });
    expect(helpHeading).toBeInTheDocument();
  });

  test('renders all expected headings', () => {
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

  test('renders support email', () => {
    render(
      <Help />
    );
    const supportEmail = screen.getByText(/support@kinforge.com/i);
    expect(supportEmail).toBeInTheDocument();
  });

  test('renders help-wrapper class', () => {
    render(
      <Help />
    );
    const helpWrapper = screen.getByTestId('help-wrapper');
    expect(helpWrapper).toBeInTheDocument();
  });

});
