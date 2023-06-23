const cellProbs = () => {
  // Probability modifiers
  const colorMod = 0.33; // Strong negative bias used to initialize all probs
  const adjacentMod = 2; // Medium positive bias for hit adjacent adjustments

  // Method that creates probs and defines initial probabilities
  const createProbs = () => {
    // Create the probs. It is a 10x10 grid of cells.
    const initialProbs = [];

    // Randomly decide which "color" on the probs to favor by randomly initializing color weight
    const initialColorWeight = Math.random() < 0.5 ? 1 : colorMod;

    // Initialize the probs with 0's
    for (let i = 0; i < 10; i += 1) {
      initialProbs.push(Array(10).fill(0));
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

        // Adjust the weights based on Barry's theory (if probs is checker probs, prefer one color)
        const barryProbability = probability * colorWeight;

        // Assign probabilty to the probs
        initialProbs[row][col] = barryProbability;

        // Flip the color weight
        colorWeight = colorWeight === 1 ? colorMod : 1;
      }
    }

    // Return the initialized probs
    return initialProbs;
  };

  // Method for normalizing the probabilities
  const normalizeProbs = (probs) => {
    let sum = 0;

    // Calculate the sum of probabilities in the probs
    for (let row = 0; row < probs.length; row += 1) {
      for (let col = 0; col < probs[row].length; col += 1) {
        sum += probs[row][col];
      }
    }

    // Normalize the probabilities
    const normalizedProbs = [];
    for (let row = 0; row < probs.length; row += 1) {
      normalizedProbs[row] = [];
      for (let col = 0; col < probs[row].length; col += 1) {
        normalizedProbs[row][col] = probs[row][col] / sum;
      }
    }

    return normalizedProbs;
  };

  // Create the probs
  const nonNormalizedProbs = createProbs();
  // Normalize the probabilities
  const probs = normalizeProbs(nonNormalizedProbs);

  // Helper methods for updateProbs
  const hitAdjacentIncrease = (hitX, hitY, largestLength) => {
    // Iterate through the cells and update them
    // North
    for (let i = 0; i < largestLength; i += 1) {
      // North if on board
      if (hitY - i >= 0) {
        probs[hitX][hitY - i] *= adjacentMod;
      }
      // South if on board
      if (hitY + i <= 9) {
        probs[hitX][hitY + i] *= adjacentMod;
      }
      // West if on board
      if (hitX - i >= 0) {
        probs[hitX - i][hitY] *= adjacentMod;
      }
      // East if on board
      if (hitX + i <= 9) {
        probs[hitX + i][hitY] *= adjacentMod;
      }
    }
  };

  const checkDeadCells = (missX, missY, smallestLength) => {
    // Check in each direction. Count empty cells in a row.
    // If that count is < smallestLength zero out those cells
  };

  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  const updateProbs = (gm) => {
    // These values are used as the evidence to update the probabilities on the probs
    const { hits, misses } = gm.userBoard;
    // Largest ship length
    let largestShipLength = null;
    for (let i = Object.keys(gm.userBoard.sunkenShips).length; i >= 1; i -= 1) {
      if (!gm.userBoard.sunkenShips[i]) {
        largestShipLength = i;
        largestShipLength = i === 1 ? 2 : largestShipLength;
        largestShipLength = i === 2 ? 3 : largestShipLength;
        break;
      }
    }
    // Smallest ship length
    let smallestShipLength = null;
    for (let i = 0; i < Object.keys(gm.userBoard.sunkenShips).length; i += 1) {
      if (!gm.userBoard.sunkenShips[i]) {
        smallestShipLength = i;
        smallestShipLength = i === 1 ? 2 : smallestShipLength;
        smallestShipLength = i === 2 ? 3 : smallestShipLength;
        break;
      }
    }

    // Update values based on hits
    Object.values(hits).forEach((hit) => {
      const [x, y] = hit;
      // If the hit is new, and therefore the prob for that hit is not yet 0
      if (probs[x][y] !== 0) {
        // Apply the increase to adjacent cells
        hitAdjacentIncrease(x, y, largestShipLength);
        // Set the probability of the hit to 0
        probs[x][y] = 0;
      }
    });

    // Update values based on misses
    Object.values(misses).forEach((miss) => {
      const [x, y] = miss;
      // Check for dead cells where hits cannot possibly be
      checkDeadCells(x, y, smallestShipLength);
      // Set the probability of every miss to 0 to prevent that cell from being targeted
      probs[x][y] = 0;
    });

    /* Apply a secondary increase to groups of cells between hits that have a group length, when 
    added to 2, not greater than the greatest remaining ship length */

    /* Reduce the chance of groups of cells that are surrounded by misses or the edge of the board 
    if the group length is not less than or equal to the greatest remaining ship length. */

    /* Ignore cells with a probability of 0 when considering groups of cells to increase efficiency. */

    /* Set the probability of cells with hits and misses to 0 to prevent duplicate attacks. */
  };

  // Method for displaying the probs
  // eslint-disable-next-line no-unused-vars
  const logProbs = (probsToLog) => {
    // Log the probs
    // eslint-disable-next-line no-console
    console.table(probsToLog);
    // Log the toal of all probs
    // eslint-disable-next-line no-console
    console.log(
      probsToLog.reduce(
        (sum, row) => sum + row.reduce((rowSum, value) => rowSum + value, 0),
        0
      )
    );
  };

  // logBoard(normalizedBoard);

  return { updateProbs, probs };
};

export default cellProbs;
