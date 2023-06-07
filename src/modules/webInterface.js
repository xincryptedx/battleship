/* This module has two primary functions:
   1. Get ship placement coordinates from the user based on their clicks on the web interface
   2. Get attack placement coordinates from the user based on the same
   3. Other minor interface actions such as handling button clicks (start game, restart, etc) */

/* Method that asks the user to supply coords
     and a direction to use for the gameboard's addShip method by clicking on a div.
     Then check that the ship was added to the gameboard, and if it was move on 
     to the next one. If it was not, ask for the placement of the same ship again.
     Move on after all 5 player ships have been placed, one of each */
