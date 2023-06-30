/* This module is used to create the initial probability array for aiBrain.
  It does this by first initializing the probabilites with a bias towards central
  cells, and then further adjusts these initial weights to create a "chess board" 
  pattern of cells that have much higher and much lower priorities, at random. So for
  example, in one game "white" cells might be heavily weighted compared to "black" cells.
  
  The reasoning for doing both of these things is explained here: 
  https://blogs.glowscotland.org.uk/glowblogs/njoldfieldeportfolio1/2015/12/01/mathematics-behind-battleship/ 
  
  In a nutshell, checkerboard because all boats are at least 2 spaces long, so you can ignore every
  other space while seeking a new ship. Central bias due to the nature of how ships take up
  space on the board. Corners will always be the least likely to have a ship, central the highest. */

// Helper method for normalizing the probabilities
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

// Method that creates probs and defines initial probabilities
const createProbs = (colorMod) => {
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

  // Create a normalized probs
  const normalizedProbs = normalizeProbs(initialProbs);

  // Return the normalized probs
  return normalizedProbs;
};

export default createProbs;
