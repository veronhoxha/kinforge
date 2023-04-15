import React from 'react';
import FamilyTree from '../pages/familyTree/familyTree'
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