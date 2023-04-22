import React from 'react';
import { render, screen } from '@testing-library/react';
import Help from './help';
import '@testing-library/jest-dom';

describe('Help', () => {

  test('renders Help component', () => {
    render(<Help />);

    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Adding Family Members')).toBeInTheDocument();
    expect(screen.getByText('Editing and Deleting Family Members')).toBeInTheDocument();
    expect(screen.getByText('Viewing and Navigating the Tree')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders paragraphs with content', () => {
    render(<Help />);

    expect(screen.getByText(/Welcome to the KinForge!/i)).toBeInTheDocument();
    expect(screen.getByText(/To add a new family member,/i)).toBeInTheDocument();
    expect(screen.getByText(/Please note that when adding family members,/i)).toBeInTheDocument();
    expect(screen.getByText(/If you need to edit or delete a family member,/i)).toBeInTheDocument();
    expect(screen.getByText(/You can navigate the tree by dragging the tree or/i)).toBeInTheDocument();
    expect(screen.getByText(/If you have any questions or need assistance,/i)).toBeInTheDocument();
  });
  
});
