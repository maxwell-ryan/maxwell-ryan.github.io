

createDeck();
var deckData = {};
//global var to store discard data
var discardData = {};
var handData = {};


//new function to draw from pileName passed as an argument
function drawFromPile(deckObj, pileName) {
  var ourReq = new XMLHttpRequest;
  //dynamically ammend apiURL with pile name we would like to draw from
  var apiURL = "https:deckofcardsapi.com/api/deck/" + deckObj.deck_id + "/pile/" + pileName + "/draw/";
  ourReq.open("GET", apiURL, false);
  ourReq.send(null);
  var pileDrawResponse = JSON.parse(ourReq.responseText);
  //return the image of the card drawn from our pile
  return pileDrawResponse.cards[0].image;
};

//our previously created discardCard function
function discardCard(deckObj, pileName, cardCode) {
 //same request setup
 var ourReq = new XMLHttpRequest();
 //dynamically build URL using parameters passed, including card to discard
 var apiURL = "https://deckofcardsapi.com/api/deck/" + deckObj.deck_id + "/pile/" + pileName + "/add/?cards=" + cardCode;

 ourReq.open("GET", apiURL, false);
 ourReq.send(null);
 var discardResponse = JSON.parse(ourReq.responseText);

 //update global discardData object for reference throughout program
 discardData = discardResponse;
};
//our previously created drawCards function
function drawCards(deckObj, numCards) {
  if(deckObj.remaining < numCards) {
    shuffleDeck(deckObj.deck_id);
   }

   var ourReq = new XMLHttpRequest();
   var apiURL = "https://deckofcardsapi.com/api/deck/" + deckObj.deck_id + "/draw/?count=" + numCards;

   ourReq.open("GET", apiURL, false);
   ourReq.send(null);
   var deckResponse = JSON.parse(ourReq.responseText);

   return deckResponse;
};
//our previously created createDeck function
function createDeck() {
  var ourDeck = new XMLHttpRequest();
  var apiURL = "https://deckofcardsapi.com/api/deck/new/"

  ourDeck.open("GET", apiURL, true);
  ourDeck.addEventListener("load", function(){
    var deckResponse = JSON.parse(ourDeck.responseText);
    deckData = deckResponse;
    shuffleDeck(deckData.deck_id);
    console.log(deckResponse);
  })
  ourDeck.send(null);
};
//our previously created shuffleDeck
function shuffleDeck(deck_id) {
  var ourDeck = new XMLHttpRequest();
  var apiURL = "https://deckofcardsapi.com/api/deck/" + deck_id + "/shuffle/";

  ourDeck.open("GET", apiURL, true);
  ourDeck.addEventListener("load", function(){
    var shuffleResponse = JSON.parse(ourDeck.responseText);
    deckData = shuffleResponse;
    handData = drawCards(deckData, 5);
  })
  ourDeck.send(null);
  console.log("deck was shuffled");
};

//buttons to discard the exact card we choose to
document.getElementById("card1btn").addEventListener("click", function() {
  discardCard(deckData, "discard", deckData.cards[0].code);
  var drawResult = drawCards(deckData, 1)
  deckData.cards[0] = drawResult.cards[0];
  document.getElementById("card1").src = deckData.cards[0].image;
});
document.getElementById("card2btn").addEventListener("click", function() {
  discardCard(deckData, "discard", deckData.cards[1].code);
  var drawResult = drawCards(deckData, 1)
  deckData.cards[1] = drawResult.cards[0];
  document.getElementById("card2").src = deckData.cards[1].image;
});
document.getElementById("card3btn").addEventListener("click", function() {
  discardCard(deckData, "discard", deckData.cards[2].code);
  var drawResult = drawCards(deckData, 1)
  deckData.cards[2] = drawResult.cards[0];
  document.getElementById("card3").src = deckData.cards[2].image;
});
document.getElementById("card4btn").addEventListener("click", function() {
  discardCard(deckData, "discard", deckData.cards[3].code);
  var drawResult = drawCards(deckData, 1)
  deckData.cards[3] = drawResult.cards[0];
  document.getElementById("card4").src = deckData.cards[3].image;
});
document.getElementById("card5btn").addEventListener("click", function() {
  discardCard(deckData, "discard", deckData.cards[4].code);
  var drawResult = drawCards(deckData, 1)
  deckData.cards[4] = drawResult.cards[0];
  document.getElementById("card5").src = deckData.cards[4].image;
});

//button to display drawn card
document.getElementById("drawButton").addEventListener("click", function(event) {
  document.getElementById("card1").src = deckData.cards[0].image;
  document.getElementById("card2").src = deckData.cards[1].image;
  document.getElementById("card3").src = deckData.cards[2].image;
  document.getElementById("card4").src = deckData.cards[3].image;
  document.getElementById("card5").src = deckData.cards[4].image;
});
