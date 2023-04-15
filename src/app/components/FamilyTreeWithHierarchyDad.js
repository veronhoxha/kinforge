import React from 'react';
import FamilyTree from '../pages/familyTree/familyTree'
import HierarchyDadSide from '../pages/hierarchy/HierarchyDadSide'

const FamilyTreeWithHierarchyDad = () => {
    return (
        <>
            <FamilyTree/>
            <HierarchyDadSide/>
        </>
    );
};

export default FamilyTreeWithHierarchyDad;