/* This module has two primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */
const webInterface = (() => {
  // #region General helper methods
  // Move any active sections off the screen
  const hideAll = () => {
    // Set proper class for css to transition elements off screen
  };
  // #endregion

  // #region Title section
  // Show the title UI
  const showTitle = () => {
    // Hide all then show proper elements by adding a class
  };

  // Hande clicks on the start game button
  const handleStartClick = () => {
    // Hide all and then show the ship placement section elements
  };
  // #endregion

  // #region Ship placement section
  /* Methods that ask the user to supply coords
     and a direction to use for the gameboard's addShip method by clicking on a div.
     Then check that the ship was added to the gameboard, and if it was move on 
     to the next one. If it was not, ask for the placement of the same ship again.
     Move on after all 5 player ships have been placed, one of each */

  // Show the ship placement UI
  const showPlacement = () => {
    // Hide all then show proper elements by adding a class
  };

  // Check if all ships placed
  const checkShipPlacement = () => {
    // Check what ships have been placed using module scope variable
    // Call showGame
  };

  const handlePlacementClick = () => {
    // Respond to a click on the placement interface
  };

  // #endregion

  // #region Game section
  // Show the game UI
  const showGame = () => {
    // Hide all then show the game section elements
  };
  // #endregion
})();

export default webInterface;
