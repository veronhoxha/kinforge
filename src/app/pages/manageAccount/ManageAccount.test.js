import React from 'react';
import { render, fireEvent, screen, act} from '@testing-library/react';
import ManageAccount from './ManageAccount';
import { BrowserRouter as Router } from 'react-router-dom';
import { auth } from '../../../firebase';
import '@testing-library/jest-dom/extend-expect';
jest.mock('../../../Authentication');

const originalPushState = window.history.pushState;
const originalGo = window.history.go;

beforeEach(() => {
    delete window.history.pushState;
    delete window.history.go;
    window.history.pushState = jest.fn();
    window.history.go = jest.fn();
});

afterEach(() => {
    window.history.pushState = originalPushState;
    window.history.go = originalGo;
});

describe('ManageAccount component', () => {

    const originalPushState = window.history.pushState;

    beforeEach(() => {
        delete window.history.pushState;
        window.history.pushState = jest.fn();
    });

    afterEach(() => {
        window.history.pushState = originalPushState;
    });

    test('shows without crashing', () => {
        render(
            <Router>
                <ManageAccount />
            </Router>
        );
    });

    test('clicking "Edit Profile" shows EditProfile component', async () => {
        render(
            <Router>
                <ManageAccount />
            </Router>
        );
        await act(async () => {
            fireEvent.click(screen.getByTestId('edit-profile'));
        });
        expect(screen.getByTestId('editprofile-component')).toBeInTheDocument();
    });

    test('clicking "Settings" shows Settings component', () => {
        render(
            <Router>
                <ManageAccount />
            </Router>
        );

        fireEvent.click(screen.getByTestId('settings'));
        expect(screen.getByTestId('settings-component')).toBeInTheDocument();
    });

    test('clicking "Help" shows Help component', () => {
        render(
            <Router>
                <ManageAccount />
            </Router>
        );

        fireEvent.click(screen.getByTestId('help'));
        expect(screen.getByTestId('help-component')).toBeInTheDocument();
    });

    test('clicking "Log Out" calls auth.signOut()', () => {
        auth.signOut = jest.fn();
        render(
            <Router>
                <ManageAccount />
            </Router>
        );

        fireEvent.click(screen.getByTestId('log-out'));
        expect(auth.signOut).toHaveBeenCalled();
    });

});
