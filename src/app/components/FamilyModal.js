import React from 'react';
import family_pic from '../media/family.png';
import '../styles/familyModal.css';
import { Link } from 'react-router-dom';

const FamilyModal = ({ open, onClose }) => {

  if (!open) return null;
  
  return (
    <>
      <div className='block-background'></div>
        <div onClick={onClose} className='overlay' data-testid='overlay'>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            data-testid='modalContainer'
            className='modalContainer'
          >
            <img src={family_pic} alt='Family' className='modalImg'/>
            <div className='modalRight'>
              <div className='content'>
                <p className='modalText'>Do you want to continue with </p>
                <h1 className='modalTitle'>Dad's family side or Mom's family side ?</h1>
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
    </>
  );
};

export default FamilyModal;