import React from 'react';
import { render, screen } from '@testing-library/react';
import FamilyTreeWithHierarchyDad from './FamilyTreeWithHierarchyDad';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../pages/familyTree/FamilyTree', () => {
  return function RandomFamilyTree() {
    return <div data-testid="family-tree"></div>;
  };
});

jest.mock('../pages/hierarchy/HierarchyDadSide', () => {
  return function RandomHierarchyMomSide() {
    return <div data-testid="hierarchy-dad-side"></div>;
  };
});

describe('FamilyTreeWithHierarchyDad component', () => {

    test('shows FamilyTreeWithHierarchyDad component', () => {
        render(
          <MemoryRouter>
            <FamilyTreeWithHierarchyDad />
          </MemoryRouter>
        );

        expect(screen.getByTestId('family-tree')).toBeInTheDocument();
        expect(screen.getByTestId('hierarchy-dad-side')).toBeInTheDocument();
    });

});
