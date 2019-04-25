const uuidv4 = require("uuid/v4");

class PlayingCard {
  constructor(imageUrl, code, value, suite) {
    this.code = code;
    this.imageUrl = imageUrl;
    this.value = value;
    this.suite = suite;
  }
}

// Create an instance of player to be used throughout the application opposed to solely using cookie data
class Player {
  constructor(cards, hasExchanged) {
    this.id = uuidv4();
    this.cards = cards;
    this.exchanged = hasExchanged;
  }
}

module.exports = {
  PlayingCard,
  Player
};
