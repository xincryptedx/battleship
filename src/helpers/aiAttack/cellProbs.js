const cellProbs = () => {
  // Probability modifiers
  const colorMod = 0.33; // Strong negative bias used to initialize all probs
  const adjacentMod = 4; // Medium positive bias for hit adjacent adjustments

  // #region Create the initial probs
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

  // #endregion

  // #region General use helpers
  // Helper that checks if valid cell on grid
  function isValidCell(row, col) {
    // Set rows and cols
    const numRows = probs[0].length;
    const numCols = probs.length;
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
  }
  // Helper that checks if cell is a boundary or miss (-1 value)
  function isBoundaryOrMiss(row, col) {
    return !isValidCell(row, col) || probs[row][col] === -1;
  }

  // #endregion

  // #region Destory mode move determination

  // Helper for loading adjacent cells into appropriate arrays
  const loadAdjacentCells = (centerCell, hits, empties) => {
    // Center Cell x and y
    const [centerX, centerY] = centerCell;
    // Adjacent values row first, then col
    const top = [centerY - 1, centerX];
    const bottom = [centerY + 1, centerX];
    const left = [centerY, centerX - 1];
    const right = [centerY, centerX + 1];

    // Fn that checks the cells and adds them to arrays
    function checkCell(cellY, cellX) {
      if (isValidCell(cellY, cellX)) {
        // If hit add to hits
        if (probs[cellX][cellY] === 0) {
          hits.push([cellX, cellY]);
          console.log(`Pushing ${cellX}, ${cellY} to adjacentHits!`);
        }
        // If empty add to empites
        else if (probs[cellX][cellY] > 0) {
          empties.push([cellX, cellY]);
          console.log(`Pushing ${cellX}, ${cellY} to adjacentempties!`);
        }
      }
    }

    checkCell(...top);
    checkCell(...bottom);
    checkCell(...left);
    checkCell(...right);
  };

  // Helper method for checking the adjacent hits for nearby empties
  const checkAdjacentCells = (hits, empties) => {
    // cellCount = 1 and will increment for every cell "away" from the cellToCheck we are considering
    let cellCount = 1;
    // Variable for coordiates to return
    let attackCoords = null;
    // If no hits then set attackCoords to an empty cell if one exists
    if (hits.length === 0 && empties.length > 0) {
      // Check each empty cell and return the most likely hit based on probs
      let maxValue = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < empties.length; i += 1) {
        const [x, y] = empties[i];
        const value = probs[x][y];
        // Update maxValue if found value bigger, along with attack coords
        if (value > maxValue) {
          maxValue = value;
          attackCoords = empties[i];
        }
      }
    }

    // If there are hits
    // cellCount++. Then, if cellCount <= biggest remaining ship length {
    //    if the next cell beyond the first in adjacentHits is empty return it
    //    if the cell is a hit, cellCount++. Then if cell count <= biggest length{
    //      if next cell beyond hit is empty return it
    //      if a hit....
    //      if empty...
    //    }
    //    if the cell is a miss stop checking in this direction by removing the adjacentHit
    //    then go back to the initial check for cellToCheck.
    // }

    return attackCoords;
  };

  // Method for destrying found ships
  const destroyModeCoords = (gm) => {
    // Look at first cell to check which will be the oldest added cell
    const cellToCheck = gm.aiBoard.cellsToCheck[0];

    // Put all adjacent cells in adjacentEmpties/adjacentHits
    const adjacentHits = [];
    const adjacentEmpties = [];
    loadAdjacentCells(cellToCheck, adjacentHits, adjacentEmpties);

    const attackCoords = checkAdjacentCells(adjacentHits, adjacentEmpties);

    // if ajdacentEmpties and adjacentHits are both empty, then no cells remain to be checked.
    // this means that the cell to check has been exhausted and should be removed from the cellsToCheck array
    // if this happens then restart this whole process by removing the first entry of cellsToCheck and
    // then continuing the process with the next cell in the front of the array
    // if somehow there are no cells remainig (logically this shouldn't be possible before a ship is sunk and destroy mode is ended)
    // then just return null, and therefore allow the backup selection process to choose an attack
    console.log(`Destroy target found! ${attackCoords}`);
    return attackCoords;
  };

  // #endregion

  // #region Helper methods for updateProbs
  const hitAdjacentIncrease = (hitX, hitY, largestLength) => {
    // Vars for calculating decrement factor
    const startingDec = 1;
    const decPercentage = 0.1;
    const minDec = 0.5;

    // Adjust for -1 values!!!!!!!!!!!!
    // Iterate through the cells and update them
    // North
    for (let i = 0; i < largestLength; i += 1) {
      let decrementFactor = startingDec - i * decPercentage;
      if (decrementFactor < minDec) decrementFactor = minDec;
      // North if on board
      if (hitY - i >= 0) {
        probs[hitX][hitY - i] *= adjacentMod * decrementFactor;
      }
      // South if on board
      if (hitY + i <= 9) {
        probs[hitX][hitY + i] *= adjacentMod * decrementFactor;
      }
      // West if on board
      if (hitX - i >= 0) {
        probs[hitX - i][hitY] *= adjacentMod * decrementFactor;
      }
      // East if on board
      if (hitX + i <= 9) {
        probs[hitX + i][hitY] *= adjacentMod * decrementFactor;
      }
    }
  };

  const checkDeadCells = () => {
    // Set rows and cols
    const numRows = probs[0].length;
    const numCols = probs.length;

    // For every cell, check the cells around it. If they are all boundary or miss then set to -1
    for (let row = 0; row < numRows; row += 1) {
      for (let col = 0; col < numCols; col += 1) {
        // If the cell is an empty cell (> 0) and adjacent cells are boundary or miss
        if (
          probs[row][col] > 0 &&
          isBoundaryOrMiss(row, col - 1) &&
          isBoundaryOrMiss(row, col + 1) &&
          isBoundaryOrMiss(row - 1, col) &&
          isBoundaryOrMiss(row + 1, col)
        ) {
          // Set that cell to a miss since it cannot be a hit
          probs[row][col] = -1;
          /* console.log(
            `${row}, ${col} surrounded and cannot be a hit. Set to miss.`
          ); */
        }
      }
    }
  };

  // #endregion

  // #region Method and helper for logging probs
  // Helper to transpose array for console.table's annoying col first approach
  const transposeArray = (array) =>
    array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
  // eslint-disable-next-line no-unused-vars
  const logProbs = (probsToLog) => {
    // Log the probs
    const transposedProbs = transposeArray(probsToLog);
    // eslint-disable-next-line no-console
    console.table(transposedProbs);
    // Log the toal of all probs
    // eslint-disable-next-line no-console
    console.log(
      probsToLog.reduce(
        (sum, row) => sum + row.reduce((rowSum, value) => rowSum + value, 0),
        0
      )
    );
  };

  // #endregion

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
        smallestShipLength = i === 0 ? 2 : smallestShipLength;
        smallestShipLength = i === 1 ? 3 : smallestShipLength;
        smallestShipLength = i > 1 ? i : smallestShipLength;
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
      // Set the probability of every miss to 0 to prevent that cell from being targeted
      probs[x][y] = -1;
    });

    /* Apply a secondary increase to groups of cells between hits that have a group length, when 
    added to 2, not greater than the greatest remaining ship length */

    /* Reduce the chance of groups of cells that are surrounded by misses or the edge of the board 
    if the group length is not less than or equal to the greatest remaining ship length. */
    checkDeadCells(smallestShipLength);

    // Optionally log the results
    // logProbs(probs);
  };

  return {
    updateProbs,
    destroyModeCoords,
    probs,
  };
};

export default cellProbs;
