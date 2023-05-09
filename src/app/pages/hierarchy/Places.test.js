import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Places from './Places';

describe('Places component', () => {

    test('shows GoogleMap', () => {
        render(
            <Places />
        );
    });

    test('works when defaultValue is provided', async () => {
        render(
            <Places defaultValue="Budapest" />
        );
    });

});
