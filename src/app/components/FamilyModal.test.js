import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import FamilyModal from './FamilyModal';
import '@testing-library/jest-dom';

jest.mock('../media/family.png', () => '../media/family.png');

describe('FamilyModal component', () => {

    test('shows FamilyModal component', () => {
        const { getByText, getByAltText } = render(
          <Router>
            <FamilyModal open={true} onClose={() => {}} />
          </Router>
        );

        const titleElement = getByText(/Dad's family side or Mom's family side/i);
        const imageElement = getByAltText('Family');
        expect(titleElement).toBeInTheDocument();
        expect(imageElement).toBeInTheDocument();
        expect(imageElement.src).toContain('family.png');
    });

    test('FamilyModal calls onClose when clicking outside the modal', () => {
        const onClose = jest.fn();
        const { getByTestId } = render(
          <Router>
            <FamilyModal open={true} onClose={onClose} />
          </Router>
        );

        const overlayElement = getByTestId('overlay');
        fireEvent.click(overlayElement);
        expect(onClose).toHaveBeenCalled();
    });

    test('FamilyModal does not call onClose when clicking inside the modal', () => {
        const onClose = jest.fn();
        const { getByTestId } = render(
          <Router>
            <FamilyModal open={true} onClose={onClose} />
          </Router>
        );
        
        const modalContainerElement = getByTestId('modalContainer');
        fireEvent.click(modalContainerElement);
        expect(onClose).not.toHaveBeenCalled();
    });

});