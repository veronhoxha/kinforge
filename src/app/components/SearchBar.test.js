import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SearchBar from './SearchBar';

describe('SearchBar component', () => {

    test('shows SearchBar component', () => {
        render(
            <Router> 
                <SearchBar />
            </Router>
        );
    });

});
