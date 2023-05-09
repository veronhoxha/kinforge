import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import EditProfile from './EditProfile';

describe('EditProfile component', () => {

    test('shows EditProfile', () => {
        render(
            <Router> 
                <EditProfile />
            </Router>
        );
    });

});
