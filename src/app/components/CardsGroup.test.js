import React from 'react';
import { render, screen } from '@testing-library/react';
import Cardsgroup from './CardsGroup';
import '@testing-library/jest-dom/extend-expect';

describe('Cardsgroup component', () => {
    
    test('shows the Cardsgroup component', () => {
        render(
          <Cardsgroup />
        );

        const cardHeadElement = screen.getByText(/Our awesome features/i);
        expect(cardHeadElement).toBeInTheDocument();
    });

    test('contains the correct number of card-holder-item elements', () => {
        render(
          <Cardsgroup />
        );
        
        const cardHolderItems = screen.getAllByTestId('card-holder-item');
        expect(cardHolderItems.length).toBe(3);
    });

});