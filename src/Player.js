/* Factory that creates and returns a player object that can take a shot at opponent's game board */
const Player = () => {
  let privateName = "";
  const thisPlayer = {
    get name() {
      return privateName;
    },
    set name(newName) {
      if (newName) {
        privateName = newName.toString();
      } else privateName = "";
    },
    gameboard: null,
    sendAttack: null,
  };

  thisPlayer.sendAttack = () => {
    // Stuff
  };

  return thisPlayer;
};

export default Player;
