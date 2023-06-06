/* Factory that creates and returns a player object that can take a shot at opponent's game board */
const Player = () => {
  let privateName = "";
  const newPlayer = {
    get name() {
      return privateName;
    },
    set name(newName) {
      privateName = newName.toString();
    },
    gameboard: null,
  };

  return newPlayer;
};

export default Player;
