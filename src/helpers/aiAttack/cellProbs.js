const cellProbs = () => {
  // Method that creates board and defines initial probabilities
  const createBoard = () => {
    // Create the board. It is a 10x10 grid of cells.
    const board = [];

    // How much to modify the unfocused color probabilities
    const colorMod = 0.5;

    // Randomly decide which "color" on the board to favor by randomly initializing color weight
    const initialColorWeight = Math.random() < 0.5 ? 1 : colorMod;

    // Initialize the board with 0's
    for (let i = 0; i < 10; i += 1) {
      board.push(Array(10).fill(0));
    }

    // Assign initial probabilities based on Alemi's theory (0.08 in corners, 0.2 in 4 center cells)
    for (let row = 0; row < 10; row += 1) {
      // On even rows start with alternate color weight
      let colorWeight = initialColorWeight;
      if (row % 2 === 0) {
        colorWeight = initialColorWeight === 1 ? colorMod : 1;
      }
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

        // Adjust the weights based on Barry's theory (if board is checker board, prefer one color)
        const barryProbability = probability * colorWeight;

        // Assign probabilty to the board
        board[row][col] = barryProbability;

        // Flip the color weight
        colorWeight = colorWeight === 1 ? colorMod : 1;
      }
    }

    // Return the initialized board
    return board;
  };
  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  // Method for normalizing the probabilities
  const normalizeBoard = (board) => {
    let sum = 0;

    // Calculate the sum of probabilities in the board
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        sum += board[row][col];
      }
    }

    // Normalize the probabilities in the board
    const normalizedBoard = [];
    for (let row = 0; row < board.length; row += 1) {
      normalizedBoard[row] = [];
      for (let col = 0; col < board[row].length; col += 1) {
        normalizedBoard[row][col] = board[row][col] / sum;
      }
    }

    return normalizedBoard;
  };

  // Create the board
  const board = createBoard();
  // Normalize the probabilities
  const normalizedBoard = normalizeBoard(board);
  // Log it
  console.table(normalizedBoard);
};

export default cellProbs;
