import Player from "./factories/Player";
import Gameboard from "./factories/Gameboard";

/* This module holds the game loop logic for starting games, creating
   required objects, iterating through turns, reporting game outcome when
   a player loses, and restart the game */
const gameManager = (() => {
  // Initialization of Player objects for user and AI
  const userPlayer = Player();
  const aiPlayer = Player();
  userPlayer.gameboard.rivalBoard = aiPlayer.gameboard;
  aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
  // Start a game
  /* -Have user add ships - Need a method/module that asks the user to supply coords
     and a direction to use for the gameboard's addShip method. 
     
     Then check that the ship was added to the gameboard, and if it was move on 
     to the next one. If it was not, ask for the placement of the same ship again.

     Move on after all 5 player ships have been placed, one of each

     -Have AI add ships - Need a method/module that automatically adds ships
     to the ai gameboard. It will need to add them one at a time based on a 
     variable ruleset that will create a bord for a given high-level "dificulty" setting */

  /* Method to determine if game is over after every turn. Checks allSunk on rival gameboard 
     and returns true or false */

  /* Method that flips a virtual coin to determine who goes first, and sets that
     player object to an active player variable

  /* Iterate between players for attacks - if above method doesn't return true, check the
     active player and have query them for their move.
     
     -For user
     -For AI */

  // Method for ending the game by reporting results

  // Method for restarting the game
})();

export default gameManager;
