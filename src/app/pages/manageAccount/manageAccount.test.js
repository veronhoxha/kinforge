import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ManageAccount from './manageAccount';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('ManageAccount component', () => {

  test('should render the ManageAccount component', () => {
    act(() => {
        render(
        <Router>
            <ManageAccount />
        </Router>
        );
    });
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  test('should show Edit Profile component when clicked', () => {
    act(() => {
        render(
        <Router>
            <ManageAccount />
        </Router>
        );
    });
  
    act(() => {
      fireEvent.click(screen.getByText('Edit Profile'));
    });
  
    const activeItem = screen.getAllByText('Edit Profile').filter((item) => item.classList.contains('active'))[0];
    expect(activeItem).toBeInTheDocument();
  });

  test('should show Settings component when clicked', async () => {
    act(() => {
        render(
        <Router>
            <ManageAccount />
        </Router>
        );
    });
    
    act(() => {
        fireEvent.click(screen.getByText('Settings'));
    });

    const activeItem = screen.getAllByText('Settings').filter((item) => item.classList.contains('active'))[0];
    expect(activeItem).toBeInTheDocument();
  });

  test('should show Help component when clicked', async () => {
    act(() => {
        render(
        <Router>
            <ManageAccount />
        </Router>
        );
    });
    
    act(() => {
        fireEvent.click(screen.getByText('Help'));
    });

    const activeItem = screen.getAllByText('Help').filter((item) => item.classList.contains('active'))[0];
    expect(activeItem).toBeInTheDocument();
  });

});
