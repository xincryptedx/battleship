
# Battle-Mech: A Single-Player Battleship Clone

Play a Battleship-like game in your browser with an intelligent AI opponent.

Also includes an AI Test mode that allows the user to test how many moves it takes for the AI to destroy all ships in a given configuration.

Created while following [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship).
## Usage
*Note: For now, requires a display at least 700px high and 650px wide.*

You can play the game [here](https://xincryptedx.github.io/battleship/), or if you want to run locally:

First install the dependencies (They are listed in the package.json file):
```javascript
npm install
```

And then start the webpack dev server with the script in package.json:

```javascript
npm run start
```

This should open index.html in a new tab in your default browser. If it doesn't open automatically then manually navigate to http://localhost:8080/ after the server is running.
## AI Implementation

There are two major pieces to how the AI functions, being "seek mode" and "destroy mode". First, an array of probabilities is initialized based on two separate game theories (discussed below) that are used when the AI is seeking a new ship to destroy.

Once a ship is found, it switches to destroy mode and uses a different methodology to destroy the ship, as well as any other ships discovered while in destroy mode.

### Seek mode
#### Alemi Weights
Cell hit probabilities are first initialized using a theory described by Alemi in *The Linear Theory of Battleship* which can be found in [this blog post](http://thevirtuosi.blogspot.com/2011/10/linear-theory-of-battleship.html).

In a nutshell, it is more likely for a cell in the center of the board to have a ship occupying it than it is for cells farther out, with the cells in the corners being the least likely.

Initializing the cells this way results in a kind of "heat map" of probabilities that is hottest in the center and coldest in the corners.

#### Barry Modification

After these initial "Alemi weights" are set, I then apply a secondary theory described by Nick Barry in [this article](https://www.washingtonpost.com/news/wonk/wp/2015/05/08/how-to-win-any-popular-game-according-to-data-scientists/). The theory describes how the gameboard can be divided up into colors like a checker or chess board, and then only one color can be prioritized for attacks while searching for a ship.

The reason why this works is that the smallest ship is two cells in length, and thus must always occupy an area containing exactly one cell of one color and one cell of the other color. By attacking only one color you avoid attacking redundant empty cells and find ships faster.

In order to implement this I modify the probability array to reflect this checkerboard pattern by applying a modifier, at random on the start of every new game, to one of the board's "colors."

This Barry Modification results in an array of probabilities that reflect the heatmap described above, but with only one color or the other not having their probabilty reduced.

#### Seek a Target

Finally, when the AI is in seek mode, as it always is at the beginning of the game, it will use these probabilities to determine what cell to attack. Currently it just uses the highes probability, but this could be modified to introduce noise to give the feeling of more randomized behavior, albeit at a likely loss of accuracy.

### Destroy mode

Once a hit is discovered using the above Seek Mode, the AI will switch to Destroy Mode. The hit is loaded into an array, cellsToCheck, and the AI will begin attempting attacks in adjacent empty cells of the cells in this array.

After an adjacent hit is discovered, the AI will continue to attack in that direction until the ship sinks or a miss is detected.

Every time there is a new hit, it gets added to the cellToCheck array. When a ship sinks, only that ship's cells are removed from the array. This ensures that if a ship sinks, and there are still cellsToCheck which represent other ships discovered while in destroy mode, that the AI will continue using destroy mode until all the discovered ships are sunk, and cellsToCheck is empty.

Once this happens the AI switches back to seek mode and the cycle continues.

### AI Test 

From the main menu, "AI Test" can be toggled on or off. If on, the AI will auto attack after the user makes their first move. It will keep attacking until all ships are destroyed, and then report the total hits it took to win.

This allows users to test various board configurations to see what is most and least effective against the AI.
## Game Implementation

### Flow

The game's main functional objects are ships, gameboards, and players. There are factory functions for each of these. These objects, especially ships and gameboards, have various methods and parameters that are used to handle various game events.

The basic implementation of the game logic is relatively simple, and was designed at first to run totally in the command line before later being connected to the web interface.

The various objects and other modules, for example the game log module, communicate with each other through the game manager module. The game manager is where all the high level responses to various game events and actions are described. 

### Web interface

The interface for the game is composed of a few major pieces. Among the various buttons and text labels, there is the game log module and the canvas containers that serve as the visual representations of the gameboards.

#### Game Log

The game log has its text updated in response to various things happening in the game, like attacks being made, hits and misses happening, ships being sunk, and a winner being determined.

There is also a scene image in the game log that represents what is being described. This is accomplished by first having a module with several images loaded and ready to use. Then the log will parse through its current messages and look for keywords. Using what it finds it chooses an appropriate image to display.

#### Canvas containers

The gameboard is represented by canvas container elements. These containers each have two overlapping canvases that together allow the user to interact with the game.

Instead of using 200-300 divs I decided it would be cleaner and more performant to just use a few canvas elements. This had a bit of a learning curve, but the result was worth it.

The bottom canvas is representative of the physical game board itself, like you would have in an actual game of battleship. It is for objects that are not drawn often, and handles drawing the grid lines, user ships, hits, and misses.

The top canvas is the overlay layer. It is used to show things that change rapidly, such as cell highlights when determining an attack or where a ship will be placed.
## Areas of Possible Improvement

### Accessibility

Making a video game accessible includes many challenges that a typical web experience might not require, and I didn't want to spend too much time on this project before moving on to other topics. However I did want to note some of the issues I thought of, and possible solutions for them.

Currently the game only works by having a user click on various parts of a canvas element. This can pose challenges for users with visual impairments. A possible solution to this could be to have divs with appropriate labels that get updated based on the mouse status.

It would also be possible to implement alternative controls, such as text inputs or maybe dropdowns.

The issue of hits and misses only being displayed visually could be solved in a similar way by having divs with labels available to screen readers that list the hits and misses.

None of these solutions are perfect though, and in something intended for wide use it would be better to build things from the ground up with these considerations in mind, rather than trying to patch holes in accessibility as you go.

### AI Difficulty

Currently the AI only has one default difficulty, but it would be possible to have different difficulty options, and the relevant modules are already largely set up for this.

For example, Easy could use only random attacks, which is the fallback attack selection method in case Seek and Destroy fail for some reason. Medium could use advanced targeting by just altering probabilites based on hits and misses, but not actually entering destroy mode. And Hard would be the current implementation using probability along with Seek and Destroy.

The difficulty could be further refined by using different strategies for picking AI ship placement. Currently the AI ships are always placed at random.

### Graphics and Web Interface

The canvas graphics are rather simple right now. This is the first project where I have used canvas elements, and I didn't want to spend too much time on them. It would be possible to make the ships, hits, misses, and even the gameboard itself look much nicer/fancier.

It would also be possible to do things like have "effects" happen for hits and misses, such as drawing shockwaves or explosions.

The web interface itself is limited right now to a minimum size. If I were to spend more time on this project I'd add style rules for mobile/smaller screens as well as event handler logic to enable touch controls.
