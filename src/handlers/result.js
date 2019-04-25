const { determineWinner } = require("../lib/gameStore");

// eslint-disable-next-line no-unused-vars
const resultHandler = (req, h) => {
  const { gameId } = req.params;
  const playerResults = determineWinner(gameId);
  console.log(playerResults);

  const isPlayerWinner = req.state.player === playerResults.winner.key;

  console.log(isPlayerWinner);

  return h.view("result", { results: playerResults, isWinner: isPlayerWinner });
};

module.exports = resultHandler;
