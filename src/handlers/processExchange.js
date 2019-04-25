const axios = require("axios");
const { getGame } = require("../lib/gameStore");

// eslint-disable-next-line no-unused-vars
const processExchangeHandler = async (req, h) => {
  const game = getGame(req.params.gameId);
  const deckId = game.deck.id;
  const playerId = req.state.player;
  const cards = req.payload;
  const exchangeIdx = [];

  cards.forEach((card, idx) => {
    if (card.discard) {
      exchangeIdx.push(idx);
    }
  });

  const drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${
    exchangeIdx.length
  }`;

  await axios
    .get(drawUrl)
    .then(res => {
      // console.log(res);
      res.data.cards.forEach((card, idx) => {
        cards[exchangeIdx[idx]] = card;
      });
    })
    .then(() => {
      game.players[playerId].cards = cards;
      game.players[playerId].exchanged = true;
    });

  return cards;
};

module.exports = processExchangeHandler;

/** Response Object
...
data: {
        deck_id: 'example',
        success: true,
        cards: [ [Object], [Object] ],
        remaining: 20 }
      }
...
*/
