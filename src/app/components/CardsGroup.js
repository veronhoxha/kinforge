import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import '../styles/cardsgroup.css';

function CardsGroup() {
  return (
    <div className='card_main'>
      <div className='card_cover'>
        <h1 className='card_head'>Our awesome features</h1>
        <div className='card_holder'>
          <div className='card-holder-item' data-testid='card-holder-item'>
            <div className='card_info'>
              <div className='icon-cards'>
                <SearchIcon/>
              </div>
              <h3 className="h3-title">Searching</h3>
              <p>Search for family members by name and surname.</p>
            </div>
          </div>
          <div className='card-holder-item' data-testid='card-holder-item'>
            <div className='card_info'>
              <div className='icon-cards'>
                <StarIcon/>
              </div>
              <h3 className="h3-title">User experience</h3>
              <p>User-friendly tools intended for optimal user satisfaction.</p>
            </div>
          </div>
          <div className='card-holder-item' data-testid='card-holder-item'>
            <div className='card_info'>
              <div className='icon-cards'>
                <ThumbUpIcon/>
              </div>
              <h3 className="h3-title">Quick Edits</h3>
              <p>The most easiest ways to add and edit your family tree data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardsGroup;