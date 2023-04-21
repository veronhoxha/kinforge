import React from 'react';
import { render, screen } from '@testing-library/react';
import FamilyTreeWithHierarchyMom from './FamilyTreeWithHierarchyMom';
import FamilyTree from '../pages/familyTree/familyTree';
import HierarchyMomSide from '../pages/hierarchy/HierarchyMomSide';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../pages/familyTree/familyTree', () => {
  return function RandomFamilyTree() {
    return <div data-testid="family-tree"></div>;
  };
});

jest.mock('../pages/hierarchy/HierarchyMomSide', () => {
  return function RandomHierarchyMomSide() {
    return <div data-testid="hierarchy-mom-side"></div>;
  };
});

describe('FamilyTreeWithHierarchyMom', () => {

  test('renders FamilyTreeWithHierarchyMom component', () => {
    render(
      <MemoryRouter>
        <FamilyTreeWithHierarchyMom />
      </MemoryRouter>
    );

    expect(screen.getByTestId('family-tree')).toBeInTheDocument();
    expect(screen.getByTestId('hierarchy-mom-side')).toBeInTheDocument();
  });

});
