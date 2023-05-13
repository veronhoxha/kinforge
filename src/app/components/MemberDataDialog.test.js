import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MemberDataDialog from './MemberDataDialog';
import '@testing-library/jest-dom';

const mockOnClose = jest.fn();

const user = {
  name: 'Veron',
  surname: 'Hoxha',
  date_of_birth: '01/04/2002',
  place_of_birth: 'Rahovec',
  date_of_death: '',
  gender: 'Male',
};

describe('MemberDataDialog component', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should show the MemberDataDialog component with user data', () => {
        render( 
            <MemberDataDialog open={true} onClose={mockOnClose} user={user} />
        );

        expect(screen.getByText('Searched person data')).toBeInTheDocument();

        expect(screen.getByText((_, element) => element.textContent === 'Name: Veron')).toBeInTheDocument();
        expect(screen.getByText((_, element) => element.textContent === 'Surname: Hoxha')).toBeInTheDocument();
        expect(screen.getByText((_, element) => element.textContent === 'Date of Birth: 01/04/2002')).toBeInTheDocument();
        expect(screen.getByText((_, element) => element.textContent === 'Place of Birth OR Current Location: Rahovec')).toBeInTheDocument();
        expect(screen.getByText((_, element) => element.textContent === 'Date of Death: ')).toBeInTheDocument();
        expect(screen.getByText((_, element) => element.textContent === 'Gender: Male')).toBeInTheDocument();
    });

    test('should show the MemberDataDialog component without user data', () => {
        render(
          <MemberDataDialog open={true} onClose={mockOnClose} user={null} />
        );

        expect(screen.getByText('Searched person data')).toBeInTheDocument();
    });

    test('should call onClose when the Close button is clicked', () => {
        render(
          <MemberDataDialog open={true} onClose={mockOnClose} user={user} />
        );

        fireEvent.click(screen.getByText('Close'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

});