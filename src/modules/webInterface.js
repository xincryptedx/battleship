/* This module has three primary functions:
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
  // Show the ship placement UI
  const showPlacement = () => {
    // Hide all then show proper elements by adding a class
  };

  // Check if all ships placed
  const checkShipPlacement = () => {
    // Check what ships have been placed using module scope variable
    // Call showGame if all ships have been placed
  };

  // Handle clicks on the ship placement grid
  const handlePlacementClick = () => {
    // Send an even trying to place the ship
    // Check the ship placement so the current ship for placement is updated properly
  };

  // #endregion

  // #region Game section
  // Show the game UI
  const showGame = () => {
    // Hide all then show the game section elements
  };

  // Handle clicks on the enemy
  const handleAttackClick = () => {
    // Send event that will attempt to send an attack based on clicked cell
  };
  // #endregion
})();

export default webInterface;