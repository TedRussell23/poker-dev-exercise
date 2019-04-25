const uuidv4 = require("uuid/v4");
const { Hand } = require("pokersolver");

let games = {};

const saveNewGame = (deck, numPlayers, firstPlayerId) => {
  const gameId = uuidv4();
  const newGame = {
    deck,
    numPlayers,
    players: { [firstPlayerId]: { cards: [], exchanged: false } }
  };
  games = { ...games, [gameId]: newGame };
  return gameId;
};

const getGame = gameId => {
  if (!games.hasOwnProperty(gameId)) {
    throw new Error(`Could not find game with id ${gameId}`);
  }

  return games[gameId];
};

const updateGame = (gameId, newGameState) => {
  games = { ...games, [gameId]: newGameState };
  return newGameState;
};

const allPlayersJoined = game =>
  Object.keys(game.players).length === game.numPlayers;

const addPlayer = (gameId, playerId) => {
  const game = getGame(gameId);
  if (allPlayersJoined(game)) {
    throw new Error("That game is already full");
  }
  const players = {
    ...game.players,
    [playerId]: { cards: [], exchanged: false }
  };
  return updateGame(gameId, { ...game, players });
};

const allPlayersExchanged = gameId => {
  const { players } = getGame(gameId);
  return (
    Object.keys(players).filter(pk => players[pk].exchanged === true).length ===
    Object.keys(players).length
  );
};

const determineWinner = gameId => {
  try {
    const { players } = getGame(gameId);
    const hands = [];
    // console.log(players);

    // Create hands required for api
    Object.keys(players).forEach(key => {
      const cardsArr = [];
      players[key].cards.forEach(card => {
        cardsArr.push(card.code);
      });
      hands.push(Hand.solve(cardsArr));
    });

    // console.log(hands);
    const winner = Hand.winners(hands); // calculates winner
    // console.log(winner);

    // TODO: Turn this into a generic model for losers and winners
    const winningPlayer = {
      key: "",
      player: {},
      description: winner[0].descr
    };

    //  match winning hand with game players from api result
    Object.keys(players).forEach(key => {
      players[key].cards.forEach(c1 => {
        winner[0].cardPool.forEach(c2 => {
          if (
            c2.value + c2.suit.toLowerCase() ===
            c1.value + c2.suit.toLowerCase()
          ) {
            winningPlayer.player = players[key];
            winningPlayer.key = key;
          }
        });
      });
    });

    // create a list of losers
    const losingPlayersKeys = Object.keys(players).filter(
      pk => players[pk] !== players[winningPlayer.key]
    );
    const losingPlayers = [];
    losingPlayersKeys.forEach(key => {
      losingPlayers.push({ [key]: players[key] });
    });

    return {
      losers: losingPlayers,
      winner: winningPlayer
    };
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  saveNewGame,
  getGame,
  updateGame,
  addPlayer,
  allPlayersJoined,
  allPlayersExchanged,
  determineWinner
};
