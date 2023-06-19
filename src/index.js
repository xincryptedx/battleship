/* eslint-disable no-unused-vars */
// Import style sheets
import "./style/reset.css";
import "./style/style.css";

// Import modules
import gameManager from "./modules/gameManager";
import Player from "./factories/Player";
import canvasAdder from "./helpers/canvasAdder";
import webInterface from "./modules/webInterface";
import placeAiShips from "./helpers/placeAiShips";
import gameLog from "./modules/gameLog";

// #region Loading/Init
// Load scene images for game log
gameLog.loadScenes();

// Initialization of Player objects for user and AI
const userPlayer = Player();
const aiPlayer = Player();
userPlayer.gameboard.rivalBoard = aiPlayer.gameboard;
aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
userPlayer.gameboard.isAi = false;
aiPlayer.gameboard.isAi = true;

// Set gameLog user game board for accurate scenes
gameLog.setUserGameboard(userPlayer.gameboard);
// Init game log scene img
gameLog.initScene();

// Initialize the web interface with gameboards
const webInt = webInterface(userPlayer.gameboard, aiPlayer.gameboard);
// Add the canvas objects now that gameboards are created
const canvases = canvasAdder(userPlayer.gameboard, aiPlayer.gameboard, webInt);
// Add canvases to gameboards
userPlayer.gameboard.canvas = canvases.userCanvas;
aiPlayer.gameboard.canvas = canvases.aiCanvas;

// #endregion

// Add ai ships
placeAiShips(1, aiPlayer.gameboard);
