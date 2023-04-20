import React from 'react';
import { render, screen } from '@testing-library/react';
import Mainsection from './mainsection';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';

describe('Mainsection component', () => {

  test('renders the Mainsection component', () => {
    render(
      <BrowserRouter>
        <Mainsection />
      </BrowserRouter>
    );
    const h1Element = screen.getByText(/KinForge/i);
    expect(h1Element).toBeInTheDocument();
  });

  test('contains the video element with the correct source', () => {
    render(
      <BrowserRouter>
        <Mainsection />
      </BrowserRouter>
    );
    const videoElement = screen.getByTestId('main-section-video');
    expect(videoElement).toHaveAttribute('src', 'family-video.mp4');
  });

  test('contains the correct paragraph text', () => {
    render(
      <BrowserRouter>
        <Mainsection />
      </BrowserRouter>
    );
    const paragraphElement = screen.getByText(/Connect with your family's past/i);
    expect(paragraphElement).toBeInTheDocument();
  });
  
});
