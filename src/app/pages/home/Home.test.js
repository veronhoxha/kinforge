import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import '@testing-library/jest-dom';

jest.mock('../../components/MainSection', () => {
  return function RandomMainsection() {
    return <div data-testid="mainsection"></div>;
  };
});

jest.mock('../../components/CardsGroup', () => {
  return function RandomCards() {
    return <div data-testid="cards"></div>;
  };
});

jest.mock('../../components/Footer', () => {
  return function RandomFooter() {
    return <div data-testid="footer"></div>;
  };
});

describe('Home component', () => {

    test('shows Home component with the child components', () => {
        render(
          <Home />
        );

        expect(screen.getByTestId('mainsection')).toBeInTheDocument();
        expect(screen.getByTestId('cards')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
      });

});
