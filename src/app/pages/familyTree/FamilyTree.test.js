import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import FamilyTree from './FamilyTree';

describe('FamilyTree component', () => {

    test('shows FamilyTree component', async () => {
        await act(async () => { 
            render(
                <Router> 
                    <FamilyTree />
                </Router>
            );
        });
    });

});
