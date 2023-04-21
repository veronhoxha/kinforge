import React from 'react';
import { render, screen } from '@testing-library/react';
import FamilyTreeWithHierarchyDad from './FamilyTreeWithHierarchyDad';
import FamilyTree from '../pages/familyTree/familyTree';
import HierarchyDadSide from '../pages/hierarchy/HierarchyDadSide';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../pages/familyTree/familyTree', () => {
  return function RandomFamilyTree() {
    return <div data-testid="family-tree"></div>;
  };
});

jest.mock('../pages/hierarchy/HierarchyDadSide', () => {
  return function RandomHierarchyMomSide() {
    return <div data-testid="hierarchy-dad-side"></div>;
  };
});

describe('FamilyTreeWithHierarchyDad', () => {

  test('renders FamilyTreeWithHierarchyDad component', () => {
    render(
      <MemoryRouter>
        <FamilyTreeWithHierarchyDad />
      </MemoryRouter>
    );

    expect(screen.getByTestId('family-tree')).toBeInTheDocument();
    expect(screen.getByTestId('hierarchy-dad-side')).toBeInTheDocument();
  });

});
