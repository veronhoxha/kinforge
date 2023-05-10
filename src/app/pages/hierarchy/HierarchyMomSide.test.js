import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HierarchyMomSide } from './HierarchyMomSide';
import { ReactFlowProvider } from 'reactflow';
import { ResizeObserver } from '@juggle/resize-observer';
global.ResizeObserver = ResizeObserver;

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

console.log = jest.fn();

describe('HierarchyMomSide component', () => {
  test('shows HierarchyMomSide component', () => {
        render(
            <ReactFlowProvider> 
                <HierarchyMomSide />
            </ReactFlowProvider>
        );
    });
});
