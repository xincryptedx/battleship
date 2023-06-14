import Player from "../factories/Player";
import canvasAdder from "../helpers/canvasAdder";
import webInterface from "./webInterface";
import placeAiShips from "../helpers/placeAiShips";

/* This module holds the game loop logic for starting games, creating
   required objects, iterating through turns, reporting game outcome when
   a player loses, and restart the game */
const gameManager = () => {
  // Initialization of Player objects for user and AI
  const userPlayer = Player();
  const aiPlayer = Player();
  userPlayer.gameboard.rivalBoard = aiPlayer.gameboard;
  aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
  userPlayer.gameboard.isAI = false;
  aiPlayer.gameboard.isAI = true;

  // Initialize the web interface with gameboards
  const webInt = webInterface(userPlayer.gameboard, aiPlayer.gameboard);
  // Add the canvas objects now that gameboards are created
  canvasAdder(userPlayer.gameboard, aiPlayer.gameboard, webInt);

  // Add ai ships
  placeAiShips(1, aiPlayer.gameboard);
  /* Method to determine if game is over after every turn. Checks allSunk on rival gameboard 
     and returns true or false */

  /* Method that flips a virtual coin to determine who goes first, and sets that
     player object to an active player variable */

  // Method for ending the game by reporting results

  // Method for restarting the game

  /* Iterate between players for attacks - if above method doesn't return true, check the
     active player and query them for their move. If above method is true, call method
     for ending the game, then method for restarting the game.
     
     -For user - set a one time event trigger for user clicking on valid attack position div
     on the web interface. It will use gameboard.rivalBoard.receiveAttack and info from the div
     html data to have the board attempt the attack. If the attack is true or false then a valid
     hit or valid miss occurred. If undefined then an invalid attack was made, typically meaning
     attacking a cell that has already had a hit or miss occur in it. If the attack is invalid 
     then reset the trigger. After a successful attack (true or false returned) then set the 
     active player to the AI and loop

     -For AI use AI module's query method and pass in relevant parameters. AI module does its
     magic and returns a position. Then use gameboard.rivalboard.receivedAttack to make and 
     confirm the attack similar to the users attacks */

  // The logic of the game manager and how the web interface responds to it will remain
  // separated by using a pubsub module
};

export default gameManager;
