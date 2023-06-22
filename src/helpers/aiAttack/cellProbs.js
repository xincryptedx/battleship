const cellProbs = () => {
  // Method that creates probs and defines initial probabilities
  const createProbs = () => {
    // Create the probs. It is a 10x10 grid of cells.
    const initialProbs = [];

    // How much to modify the unfocused color probabilities
    const colorMod = 0.5;

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

  // These values are used as the evidence to update the probabilities on the probs
  let sunkenShips;
  let hits;
  let misses;
  // Method for updating these values from the game manager
  const updateEvidence = (gm) => {
    sunkenShips = gm.userBoard.sunkenShips;
    hits = gm.userBoard.hits;
    misses = gm.userBoard.misses;
  };

  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  const updateProbs = (gm) => {
    // First get the updated evidence
    updateEvidence(gm);
    // Set the probability of every hit and missed cell to 0 to prevent that cell from being targeted
    Object.values(hits).forEach((hit) => {
      const [x, y] = hit;
      probs[x][y] = 0;
    });
    Object.values(misses).forEach((miss) => {
      const [x, y] = miss;
      probs[x][y] = 0;
    });
    // Update probability of cells adjacent to hit
    /* If hit surrounded by non-attacked cells then increase adjacent probabilities based
       on sunkenShips, where more cells away from the hit are affected if larger ships remain.
       This should be done by having a prob mod that is reduced based on how many cells away.
       If hit has another hit next to it then only increase the probability of the cells on that
       axis, and decrease the probability of adjacent cells not on that axis to account for previous
       increase that now should be discounted. */
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
