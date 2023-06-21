const cellProbs = () => {
  // Method that creates board and defines initial probabilities
  const createBoard = () => {
    // Create the board. It is a 10x10 grid of cells.
    const board = [];
    for (let i = 0; i < 10; i += 1) {
      board.push(Array(10).fill(0));
    }
    // Assign initial probabilities based on Alemi's theory (0.08 in corners, 0.2 in 4 center cells)
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        // Calculate the distance from the center
        const centerX = 4.5;
        const centerY = 4.5;
        const distanceFromCenter = Math.sqrt(
          (row - centerX) ** 2 + (col - centerY) ** 2
        );

        // Calculate the probability based on Euclidean distance from center
        const minProbability = 0.08;
        const maxProbability = 0.2;
        const probability =
          minProbability +
          (maxProbability - minProbability) *
            (1 - distanceFromCenter / Math.sqrt(4.5 ** 2 + 4.5 ** 2));

        board[row][col] = probability;
      }
    }
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
