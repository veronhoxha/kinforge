import React from 'react';
import '../../../styles/help.css';
import Authentication from '../../../../Authentication';

function Help() {
  return (
    <div className="help" data-testid="help-component">
       <div className="help-wrapper" data-testid="help-wrapper">

      <h2>Help</h2>
      <p>Welcome to the KinForge! Here, you'll find information and guidance on how to use our web application to create and explore your family tree. In KinForge you can create two family trees: one for dad's side and one for mom's side. In the dad's tree, only blood-related relatives, and so to in the mom's tree.</p>
  
      <h3>Adding Family Members</h3>
      <p>To add a new family member, drag from the rectangle shape in the node and drop it and then click in the specfic node and fill in the required details. You can include their name, surname, date of birth, place of birth or current location, date of death and gender.</p>
      <br></br>
      <p>Please note that when adding family members, you can only add lower order relatives, such as children. Once a child has been added to the tree, you cannot add their parent(s). This is because our system is designed to reflect the hierarchical structure of a family tree, where higher order members are connected to their lower order descendants.</p>
      
      <h3>Editing and Deleting Family Members</h3>
      <p>If you need to edit or delete a family member, click on their node in the tree view. You'll see the form coming up and it allows you to update their information, and the "Delete Member" button to remove them from the tree. Please note that deleting a person will also remove all their relationships in the tree. Moreover you cannot delete just an edge you can only delete nodes which with them also the incoming and outgoing edges will be removed.</p>

      <h3>Viewing and Navigating the Tree</h3>
      <p>You can navigate the tree by dragging the tree or using the zoom in and out buttons.</p>

      <h3>Exporting family tree as PNG</h3>
      <p>To export your family tree as a PNG file, click on your image on the main page to see the drop-down menu, where you can find this option. However, it's important to adjust your family tree using the control buttons located at the bottom-left corner of the screen, especially if you have a large tree, so that the entire tree can be exported properly.</p>

      <h3>Contact Us</h3>
      <p>If you have any questions or need assistance, don't hesitate to contact our support team at support@kinforge.com. We're always here to help you get the most out of your family tree experience!</p>
    
    </div>
    </div>
  );
};

export default Authentication(Help);