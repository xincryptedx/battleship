const cellProbs = () => {
  // Method that creates board and defines initial probabilities
  const createBoard = () => {
    // Create the board. It is a 10x10 grid of cells.
    const board = [];
    for (let i = 0; i < 10; i += 1) {
      board.push(Array(10).fill(0));
    }
    // Assign initial probabilities based on Alemi's theory (0.08 in corners, 0.2 in 4 center cells)
    // Adjust the weights based on Barry's theory (if board is checker board, prefer one color)
    // Optionally display the output in the console
    console.table(board);
    // Return the initialized board
  };
  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  // Method for normalizing the probabilities
  createBoard();
};

export default cellProbs;
