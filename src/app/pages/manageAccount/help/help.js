import React from 'react';
import '../../../styles/help.css';

function Help() {
  return (
    <div className="help">
       <div className="help-wrapper">
      <h2>Help</h2>

      <p>Welcome to the KinForge! Here, you'll find information and guidance on how to use our web application to create and explore your family tree.</p>
  
      <h3>Adding Family Members</h3>

      <p>To add a new family member, drag from the rectangle shape in the node and drop it and then click in the specfic node and fill in the required details. You can include their name, surname, date of birth, place of birth or current location, date of death and gender.</p>

      <h3>Editing and Deleting Family Members</h3>

      <p>If you need to edit or delete a family member, click on their node in the tree view. You'll see the form coming up and it allows you to update their information, and the "Delete Member" button to remove them from the tree. Please note that deleting a person will also remove all their relationships in the tree.</p>

      <h3>Viewing and Navigating the Tree</h3>

      <p>You can navigate the tree by dragging the tree or using the zoom in and out buttons.</p>

      <h3>Contact Us</h3>
      
      <p>If you have any questions or need assistance, don't hesitate to contact our support team at support@kinforge.com. We're always here to help you get the most out of your family tree experience!</p>
    </div>
    </div>
  );
};

export default Help;