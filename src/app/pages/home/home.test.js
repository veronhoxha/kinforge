import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './home';
import Mainsection from '../../components/mainsection';
import Cards from '../../components/cardsgroup';
import Footer from '../../components/footer';
import '@testing-library/jest-dom';

jest.mock('../../components/mainsection', () => {
  return function RandomMainsection() {
    return <div data-testid="mainsection"></div>;
  };
});

jest.mock('../../components/cardsgroup', () => {
  return function RandomCards() {
    return <div data-testid="cards"></div>;
  };
});

jest.mock('../../components/footer', () => {
  return function RandomFooter() {
    return <div data-testid="footer"></div>;
  };
});

describe('Home', () => {

  test('renders Home component with the child components', () => {
    render(<Home />);

    expect(screen.getByTestId('mainsection')).toBeInTheDocument();
    expect(screen.getByTestId('cards')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

});
