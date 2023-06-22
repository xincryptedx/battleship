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
