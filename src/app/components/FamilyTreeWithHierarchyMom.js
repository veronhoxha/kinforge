import React from 'react';
import FamilyTree from '../pages/familyTree/FamilyTree'
import HierarchyMomSide from '../pages/hierarchy/HierarchyMomSide'

const FamilyTreeWithHierarchyMom = () => {
    return (
        <>
            <FamilyTree/>
            <HierarchyMomSide/>
        </>
    );
};

export default FamilyTreeWithHierarchyMom;