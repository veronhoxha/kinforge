import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import EditProfile from './EditProfile';

describe('EditProfile component', () => {

    test('shows EditProfile component', async () => {
        await act(async () => { 
            render(
                <Router>
                    <EditProfile />
                </Router>
            );
        });
    });

});