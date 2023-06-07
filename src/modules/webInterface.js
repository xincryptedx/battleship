/* This module has two primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
const webInterface = (() => {
  // #region Ship Placement
  /* Methods that ask the user to supply coords
     and a direction to use for the gameboard's addShip method by clicking on a div.
     Then check that the ship was added to the gameboard, and if it was move on 
     to the next one. If it was not, ask for the placement of the same ship again.
     Move on after all 5 player ships have been placed, one of each */

  // Show the ship placement UI
  const showPlacementUi = () => {
    // Show/hide html elements
  };

  // Move from placement to game
  const showGameUi = () => {
    // Show/hide html elements
  };

  // Check if all ships placed
  const checkShipPlacement = () => {
    // Check what ships have been placed using module scope variable
    // Call method for moving on to game if all ships placed
  };

  const handlePlacementClick = () => {
    // Respond to a click on the placement interface
  };

  // #endregion
})();

export default webInterface;
