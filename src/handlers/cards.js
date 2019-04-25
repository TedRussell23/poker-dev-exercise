const { getGame } = require("../lib/gameStore");

// eslint-disable-next-line no-unused-vars
const cardsHandler = (req, h) => {
  const game = getGame(req.params.gameId);
  const playerId = req.state.player;

  console.log(playerId);

  return game.players[playerId].cards;
};

module.exports = cardsHandler;
