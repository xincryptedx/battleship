const randomShips = (gameboard, gridX, gridY) => {
  // Get random placement
  const x = Math.floor(Math.random() * gridX);
  const y = Math.floor(Math.random() * gridY);
  const direction = Math.round(Math.random());
  // Try the placement

  gameboard.addShip([x, y], direction);
};

export default randomShips;
