/* This module serves as the intelligence of the AI player. It uses a 2d array of hit 
probabilities, made available to aiAttack, to determine attack coords when the AI is in 
seek mode. When a new hit is found and the AI switches to destroy mode a different set of
methods are used to destroy found ships quickly and logically. There is also a set of methods
for updating the probabilities in response to hits and ships being sunk in order to better
determine attacks while in destroy mode. */

import createProbs from "./createProbs";

const aiBrain = () => {
  // Probability modifiers
  const colorMod = 0.33; // Strong negative bias used to initialize all probs
  const adjacentMod = 4; // Medium positive bias for hit adjacent adjustments

  // Create the probs
  const probs = createProbs(colorMod);

  // Copy the initial probs for later use
  const initialProbs = probs.map((row) => [...row]);

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

  // Helpers for getting remaining ship lengths
  const getLargestRemainingLength = (gm) => {
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
    return largestShipLength;
  };

  const getSmallestRemainingLength = (gm) => {
    let smallestShipLength = null;
    for (let i = 0; i < Object.keys(gm.userBoard.sunkenShips).length; i += 1) {
      if (!gm.userBoard.sunkenShips[i]) {
        smallestShipLength = i === 0 ? 2 : smallestShipLength;
        smallestShipLength = i === 1 ? 3 : smallestShipLength;
        smallestShipLength = i > 1 ? i : smallestShipLength;
        break;
      }
    }
    return smallestShipLength;
  };

  // #endregion

  // #region Destory mode move determination

  /* The general idea here is to cause the AI to do what human players do upon finding
    a new ship. Typically when you find a ship you start attacking adjacent cells to 
    find the "next part" of the ship, changing to other adjacent cells when finding a miss,
    or going in the other direction when a mis is found after a hit, etc.
    
    This is accomplished using lists of cells to check and recursive logic to keep checking
    the "next cell" after an adjacent hit is found, as well as to recursively keep checking
    if a ship is sunk, but other hits exist that aren't part of the sunken ship, which
    indicates more ships that have been discovered but not yet sunk. */

  // Helper for loading adjacent cells into appropriate arrays
  const loadAdjacentCells = (centerCell, adjacentHits, adjacentEmpties, gm) => {
    // Center Cell x and y
    const [centerX, centerY] = centerCell;
    // Adjacent values row first, then col
    const top = [centerY - 1, centerX, "top"];
    const bottom = [centerY + 1, centerX, "bottom"];
    const left = [centerY, centerX - 1, "left"];
    const right = [centerY, centerX + 1, "right"];

    // Fn that checks the cells and adds them to arrays
    function checkCell(cellY, cellX, direction) {
      if (isValidCell(cellY, cellX)) {
        // If hit and not occupied by sunken ship add to hits
        if (
          probs[cellX][cellY] === 0 &&
          !gm.userBoard.isCellSunk([cellX, cellY])
        ) {
          adjacentHits.push([cellX, cellY, direction]);
        }
        // If empty add to empites
        else if (probs[cellX][cellY] > 0) {
          adjacentEmpties.push([cellX, cellY, direction]);
        }
      }
    }

    checkCell(...top);
    checkCell(...bottom);
    checkCell(...left);
    checkCell(...right);
  };

  // Helper that returns highest prob adjacent empty
  const returnBestAdjacentEmpty = (adjacentEmpties) => {
    let attackCoords = null;
    // Check each empty cell and return the most likely hit based on probs
    let maxValue = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < adjacentEmpties.length; i += 1) {
      const [x, y] = adjacentEmpties[i];
      const value = probs[x][y];
      // Update maxValue if found value bigger, along with attack coords
      if (value > maxValue) {
        maxValue = value;
        attackCoords = [x, y];
      }
    }
    return attackCoords;
  };

  // Helper method for handling adjacent hits recursively
  const handleAdjacentHit = (
    gm,
    adjacentHits,
    adjacentEmpties,
    cellCount = 0
  ) => {
    // Increment cell count
    let thisCount = cellCount + 1;

    // Biggest ship length
    const largestShipLength = getLargestRemainingLength(gm);

    // If thisCount is bigger than the biggest possible line of ships
    if (thisCount > largestShipLength) {
      return null;
    }

    // Get the adjacent hit to consider
    const hit = adjacentHits[0];
    const [hitX, hitY, direction] = hit;

    // The next cell in the same direction
    let nextCell = null;
    if (direction === "top") nextCell = [hitX, hitY - 1];
    else if (direction === "bottom") nextCell = [hitX, hitY + 1];
    else if (direction === "left") nextCell = [hitX - 1, hitY];
    else if (direction === "right") nextCell = [hitX + 1, hitY];
    const [nextX, nextY] = nextCell;

    // Ref to found empty cell
    let foundEmpty = null;

    // If cell count is not larger than the biggest remaining ship
    const checkNextCell = (nX, nY) => {
      if (thisCount <= largestShipLength) {
        // If next cell is a miss stop checking in this direction by removing the adjacentHit
        if (probs[nX][nY] === -1 || !isValidCell(nY, nX)) {
          adjacentHits.shift();
          // Then if adjacent hits isn't empty try to handle the next adjacent hit
          if (adjacentHits.length > 0) {
            foundEmpty = handleAdjacentHit(gm, adjacentHits, adjacentEmpties);
          }
          // Else if it is empty try to return the best adjacent empty cell
          else {
            foundEmpty = returnBestAdjacentEmpty(adjacentEmpties);
          }
        }
        // If the cell is a hit
        else if (probs[nX][nY] === 0) {
          // Increment the cell count
          thisCount += 1;
          // New next cell ref
          let newNext = null;
          // Increment the nextCell in the same direction as adjacent hit being checked
          if (direction === "top") newNext = [nX, nY - 1];
          else if (direction === "bottom") newNext = [nX, nY + 1];
          else if (direction === "left") newNext = [nX - 1, nY];
          else if (direction === "right") newNext = [nX + 1, nY];
          // Set nextX and nextY to the coords of this incremented next cell
          const [newX, newY] = newNext;
          // Recursively check the next cell
          checkNextCell(newX, newY);
        }
        // The cell is empty and valid
        else if (isValidCell(nY, nX) && probs[nX][nY] > 0) {
          foundEmpty = [nX, nY];
        }
      }
    };

    // Initial call to above recursive helper
    if (thisCount <= largestShipLength) {
      checkNextCell(nextX, nextY);
    }

    return foundEmpty;
  };

  // Helper method for checking the adjacent hits for nearby empties
  const checkAdjacentCells = (adjacentHits, adjacentEmpties, gm) => {
    // Variable for coordiates to return
    let attackCoords = null;

    // If no hits then set attackCoords to an empty cell if one exists
    if (adjacentHits.length === 0 && adjacentEmpties.length > 0) {
      attackCoords = returnBestAdjacentEmpty(adjacentEmpties);
    }

    // If there are hits then handle checking cells after them to find empty for attack
    if (adjacentHits.length > 0) {
      attackCoords = handleAdjacentHit(gm, adjacentHits, adjacentEmpties);
    }

    return attackCoords;
  };

  // Method for destrying found ships
  const destroyModeCoords = (gm) => {
    // Look at first cell to check which will be the oldest added cell
    const cellToCheck = gm.aiBoard.cellsToCheck[0];

    // Put all adjacent cells in adjacentEmpties/adjacentHits
    const adjacentHits = [];
    const adjacentEmpties = [];
    loadAdjacentCells(cellToCheck, adjacentHits, adjacentEmpties, gm);

    const attackCoords = checkAdjacentCells(adjacentHits, adjacentEmpties, gm);

    // If ajdacentEmpties and adjacentHits are both empty and attack coords null
    if (
      attackCoords === null &&
      adjacentHits.length === 0 &&
      adjacentEmpties.length === 0
    ) {
      // Remove the first entry of cells to check
      gm.aiBoard.cellsToCheck.shift();
      // If cells remain to be checked
      if (gm.aiBoard.cellsToCheck.length > 0) {
        // Try using the next cell to check for destroyModeCoords
        destroyModeCoords(gm);
      }
    }

    // console.log(`Destroy target found! ${attackCoords}`);
    return attackCoords;
  };

  // #endregion

  // #region Methods for updating probs on hit and miss

  /* When a hit is first discovered, horizontal and vertical cells get a stacking,
    temporariy probability increase. This is to help direct the destroy process to
    choose the best cells while destroying, for example only attacking empty cells
    in the same direction as the likely ship placement.
    
    After all currently discovered ships are destroyed, the probabilities of remaining
    empty cells are brought back to their initial values so as to not disrupt the optimal
    seeking process when looking for the next ship. */

  // Records wich cells were altered with hidAdjacentIncrease
  const increasedAdjacentCells = [];
  // Increase adjacent cells to new hits
  const hitAdjacentIncrease = (hitX, hitY, largestLength) => {
    // Vars for calculating decrement factor
    const startingDec = 1;
    const decPercentage = 0.1;
    const minDec = 0.5;

    // Iterate through the cells and update them
    // North
    for (let i = 0; i < largestLength; i += 1) {
      let decrementFactor = startingDec - i * decPercentage;
      if (decrementFactor < minDec) decrementFactor = minDec;
      // North if on board
      if (hitY - i >= 0) {
        // Increase the probability
        probs[hitX][hitY - i] *= adjacentMod * decrementFactor;
        // Record the cell to increased adjacent cells for later use
        increasedAdjacentCells.push([hitX, hitY - i]);
      }
      // South if on board
      if (hitY + i <= 9) {
        probs[hitX][hitY + i] *= adjacentMod * decrementFactor;
        increasedAdjacentCells.push([hitX, hitY + i]);
      }
      // West if on board
      if (hitX - i >= 0) {
        probs[hitX - i][hitY] *= adjacentMod * decrementFactor;
        increasedAdjacentCells.push([hitX - i, hitY]);
      }
      // East if on board
      if (hitX + i <= 9) {
        probs[hitX + i][hitY] *= adjacentMod * decrementFactor;
        increasedAdjacentCells.push([hitX + i, hitY]);
      }
    }
  };

  const resetHitAdjacentIncreases = () => {
    // If list empty then just return
    if (increasedAdjacentCells.length === 0) return;
    // If the values in the list are still empty
    for (let i = 0; i < increasedAdjacentCells.length; i += 1) {
      const [x, y] = increasedAdjacentCells[i];
      if (probs[x][y] > 0) {
        // Re-initialize their prob value
        probs[x][y] = initialProbs[x][y];
        // And remove them from the list
        increasedAdjacentCells.splice(i, 1);
        // Reset the iterator
        i = -1;
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

  // Method that updates probabilities based on hits, misses, and remaining ships' lengths
  const updateProbs = (gm) => {
    // These values are used as the evidence to update the probabilities on the probs
    const { hits, misses } = gm.userBoard;

    // Largest ship length
    const largestShipLength = getLargestRemainingLength(gm);
    // Smallest ship length
    const smallestShipLength = getSmallestRemainingLength(gm);

    // Update values based on hits
    Object.values(hits).forEach((hit) => {
      const [x, y] = hit;
      // If the hit is new, and therefore the prob for that hit is not yet 0
      if (probs[x][y] !== 0) {
        // Apply the increase to adjacent cells. This will be reduced to inital probs on seek mode.
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

    /* Reduce the chance of groups of cells that are surrounded by misses or the edge of the board 
      if the group length is not less than or equal to the greatest remaining ship length. */
    checkDeadCells(smallestShipLength);

    // Optionally log the results
    // logProbs(probs);
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

  return {
    updateProbs,
    resetHitAdjacentIncreases,
    destroyModeCoords,
    probs,
  };
};

export default aiBrain;
