import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Settings from './settings';

jest.mock('firebase/auth', () => {
    return {
      getAuth: jest.fn(() => {
        return {
          currentUser: {
            uid: '22222222',
            email: 'veronhoxha@yahoo.com',
          },
          onAuthStateChanged: jest.fn((callback) => {
            callback({ uid: '22222222' });
            return () => {}; 
          }),
        };
      }),
    };
  });

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(() => {}),
    doc: jest.fn(() => {}),
    setDoc: jest.fn(() => {}),
    getDoc: jest.fn(() => {
      return {
        exists: () => true,
        data: () => ({ activeSwitch: 1 }),
      };
    }),
  };
});

describe('Settings', () => {

  test('renders change password button', () => {
    render(<Settings />);
    const changePasswordButton = screen.getByText('Change Password');
    expect(changePasswordButton).toBeInTheDocument();
  });

  test('renders hierarchy design button', () => {
    render(<Settings />);
    const hierarchyDesignButton = screen.getByText('Hierarchy design');
    expect(hierarchyDesignButton).toBeInTheDocument();
  });

  test('shows and hides password form when change password button is clicked', async () => {
    render(<Settings />);
    const changePasswordButton = screen.getByText('Change Password');

    userEvent.click(changePasswordButton);
    const currentPasswordLabel = await screen.findByText('Current Password:');
    expect(currentPasswordLabel).toBeInTheDocument();

    userEvent.click(changePasswordButton);
    await waitFor(() => {
      expect(currentPasswordLabel).not.toBeInTheDocument();
    });
  });

  test('shows and hides hierarchy design form when hierarchy design button is clicked', async () => {
    render(<Settings />);
    const hierarchyDesignButton = screen.getByText('Hierarchy design');

    userEvent.click(hierarchyDesignButton);

    const rectangleNodesLabel = await screen.findByText('Rectangle Nodes');
    const ellipseNodesLabel = await screen.findByText('Ellipse Nodes');
    const ovalNodesLabel = await screen.findByText('Oval Nodes');
    expect(rectangleNodesLabel).toBeInTheDocument();
    expect(ellipseNodesLabel).toBeInTheDocument();
    expect(ovalNodesLabel).toBeInTheDocument();

    userEvent.click(hierarchyDesignButton);
    await waitFor(() => {
      expect(rectangleNodesLabel).not.toBeInTheDocument();
      expect(ellipseNodesLabel).not.toBeInTheDocument();
      expect(ovalNodesLabel).not.toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});