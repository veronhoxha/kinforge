import React from 'react';
import '../../../styles/help.css';

function Help() {
  return (
    <div className="help">
       <div className="help-wrapper">
      <h2>Help</h2>

      <p>Welcome to the KinForge! Here, you'll find information and guidance on how to use our web application to create and explore your family tree.</p>
  
      <h3>Adding Family Members</h3>

      <p>To add a new family member, click the "Add Person" button and fill in the required details. You can include their name, birth date, and other relevant information. After adding a person, you can connect them to other family members by specifying their relationships (e.g., parent, spouse, sibling).</p>

      <h3>Editing and Deleting Family Members</h3>

      <p>If you need to edit or delete a family member, click on their name in the tree view. You'll see an "Edit" button that allows you to update their information, and a "Delete" button to remove them from the tree. Please note that deleting a person will also remove all their relationships in the tree.</p>

      <h3>Viewing and Navigating the Tree</h3>

      <p>Once you've added family members and relationships, you can view the tree in its entirety by clicking the "Tree View" button. You can navigate the tree by clicking and dragging or using the zoom in and out buttons. If you'd like to focus on a specific individual, simply click on their name, and the tree will center on them.</p>

      <h3>Contact Us</h3>
      
      <p>If you have any questions or need assistance, don't hesitate to contact our support team at support@kinforge.com. We're always here to help you get the most out of your family tree experience!</p>
    </div>
    </div>
  );
};

export default Help;