import React from 'react';
import { render, screen } from '@testing-library/react';
import Mainsection from './MainSection';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import video from '../media/family-video.mp4'; 

describe('Mainsection component', () => {

    test('shows the Mainsection component', () => {
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
        expect(videoElement).toHaveAttribute('src', video);
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