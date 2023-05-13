import React from 'react';
import { render, screen } from '@testing-library/react';
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

    test('shows search bar input correctly', () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );
        const searchBar = screen.getByTestId('search-bar');
        expect(searchBar).toBeInTheDocument();
    });

    test('shows search and clear icons correctly', () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );
        const searchIcon = screen.getByTestId('search-icon');
        expect(searchIcon).toBeInTheDocument();

        const clearIcon = screen.queryByTestId('clear-icon');
        expect(clearIcon).not.toBeInTheDocument();
    });

    test('does not show search results panel with no search term', () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );
        const searchResultsPanel = screen.queryByTestId('search-results-panel');
        expect(searchResultsPanel).not.toBeInTheDocument();
    });

    test('does not show search results panel with no filtered users', () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );

        const originalUseState = React.useState;
        React.useState = jest.fn(() => originalUseState([]));
        const searchResultsPanel = screen.queryByTestId('search-results-panel');
        expect(searchResultsPanel).not.toBeInTheDocument();
        React.useState = originalUseState;
    });

});