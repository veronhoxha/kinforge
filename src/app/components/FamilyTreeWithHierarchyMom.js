import React from 'react';
import FamilyTree from '../pages/familyTree/familyTree'
import HierarchyMomSide from '../pages/hierarchy/HierarchyMomSide'

const FamilyTreeWithHierarchy = () => {
    return (
        <>
            <FamilyTree/>
            <HierarchyMomSide/>
        </>
    );
};

export default FamilyTreeWithHierarchy;
