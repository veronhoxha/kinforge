import React from 'react';
import FamilyTree from '../pages/familyTree/familyTree'
import HierarchyDadSide from '../pages/hierarchy/HierarchyDadSide'

const FamilyTreeWithHierarchy = () => {
    return (
        <>
            <FamilyTree/>
            <HierarchyDadSide/>
        </>
    );
};

export default FamilyTreeWithHierarchy;
