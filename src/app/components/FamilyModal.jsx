import React from 'react';
import family_pic from '../media/family.png';
import '../styles/familyModal.css';
import { Link } from 'react-router-dom';

const FamilyModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <img src={family_pic} alt='/' className='modalImg'/>
        <div className='modalRight'>
          <div className='content'>
            <p className='modalText'>Do you want to do </p>
            <h1 className='modalTitle'>Dad's family side or Mom's family side</h1>
            <p className='modalText'>first?</p>
        </div>
        <div className='btnContainer'>
          <Link to='/familyTree' className='linkbtnPrimary'>
            <button className='btnPrimary' onClick={onClose}>
              <span className='bold'>Dad's side</span>
            </button>
          </Link>
          <Link to='/familyTreeMom' className='linkbtnOutline'>
            <button className='btnOutline' onClick={onClose}>
              <span className='bold'>Mom's side</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default FamilyModal;
