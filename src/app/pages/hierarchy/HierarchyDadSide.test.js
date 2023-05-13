import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HierarchyDadSide } from './HierarchyDadSide';
import { ReactFlowProvider } from 'reactflow';
import { ResizeObserver } from '@juggle/resize-observer';
global.ResizeObserver = ResizeObserver;

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

console.log = jest.fn();

describe('HierarchyDadSide component', () => {
  test('shows HierarchyDadSide component', () => {
        render(
            <ReactFlowProvider> 
                <HierarchyDadSide />
            </ReactFlowProvider>
        );
    });
});