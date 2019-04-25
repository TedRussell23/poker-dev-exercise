const { determineWinner } = require("../lib/gameStore");

// eslint-disable-next-line no-unused-vars
const resultHandler = (req, h) => {
  const { gameId } = req.params;
  const playerResults = determineWinner(gameId);
  const isPlayerWinner = req.state.player === playerResults.winner.key;

  console.log(playerResults);
  console.log(isPlayerWinner);

  return h.view("result", { playerResults, isPlayerWinner });
};

module.exports = resultHandler;
