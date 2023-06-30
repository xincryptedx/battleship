/* This helper places ships randomly on a gameboard until all 
5 ships have been placed. It uses recursion to do this, ensuring
the method is tried over and over until a sufficient board configuration
is returned. */

const randomShips = (gameboard, gridX, gridY) => {
  // Exit from recursion
  if (gameboard.ships.length > 4) return;
  // Get random placement
  const x = Math.floor(Math.random() * gridX);
  const y = Math.floor(Math.random() * gridY);
  const direction = Math.round(Math.random());

  // Try the placement
  gameboard.addShip([x, y], direction);

  // Keep doing it until all ships are placed
  randomShips(gameboard, gridX, gridY);
};

export default randomShips;
