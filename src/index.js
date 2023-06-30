/* eslint-disable no-unused-vars */
// Import style sheets
import "./style/reset.css";
import "./style/style.css";

// Import modules
import gameManager from "./modules/gameManager";
import Player from "./factories/Player";
import canvasAdder from "./helpers/canvasAdder";
import webInt from "./modules/webInterface";
import placeAiShips from "./helpers/placeAiShips";
import gameLog from "./modules/gameLog";
import sounds from "./modules/sounds";

// #region Loading/Init
// Ref to loading screen
const loadingScreen = document.querySelector(".loading-screen");

// Ref to game manager instance
const gm = gameManager();

// Initialize the web interface with gm ref
const webInterface = webInt(gm);

// Initialize sound module
const soundPlayer = sounds();

// Load scene images for game log
gameLog.loadScenes();

// Initialization of Player objects for user and AI
const userPlayer = Player(gm); // Create players
const aiPlayer = Player(gm);
userPlayer.gameboard.rivalBoard = aiPlayer.gameboard; // Set rival boards
aiPlayer.gameboard.rivalBoard = userPlayer.gameboard;
userPlayer.gameboard.isAi = false; // Set ai or not
aiPlayer.gameboard.isAi = true;

// Set gameLog user game board for accurate scenes
gameLog.setUserGameboard(userPlayer.gameboard);
// Init game log scene img
gameLog.initScene();

// Add the canvas objects now that gameboards are created
const canvases = canvasAdder(
  userPlayer.gameboard,
  aiPlayer.gameboard,
  webInterface,
  gm
);
// Add canvases to gameboards
userPlayer.gameboard.canvas = canvases.userCanvas;
aiPlayer.gameboard.canvas = canvases.aiCanvas;

// Add boards and canvases to gameManager
gm.userBoard = userPlayer.gameboard;
gm.aiBoard = aiPlayer.gameboard;
gm.userCanvasContainer = canvases.userCanvas;
gm.aiCanvasContainer = canvases.aiCanvas;
gm.placementCanvasContainer = canvases.placementCanvas;

// Add modules to gameManager
gm.webInterface = webInterface;
gm.soundPlayer = soundPlayer;
gm.gameLog = gameLog;
// #endregion

// Add ai ships
placeAiShips(1, aiPlayer.gameboard);

// Hide the loading screen after min timeout
setTimeout(() => {
  loadingScreen.classList.add("hidden");
}, 1000);
