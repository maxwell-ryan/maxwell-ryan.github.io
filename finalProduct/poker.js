
//object to store the deck that will persist throughout entire game
var deckData = {};
//object to store player's current hand
var handData = {};
//object to store discard pile infomration
var discardData = {};
//bools to track if a hand is in progress, and whether discarding has occured yet (1 discard event per hand)
var handInProgress = false;
var discardAvailable = true;

//this is an AJAX request for a new deck, that will callback to shuffleDeck when the new deck request is received
createDeck();

//create deck function, which calls shuffleDeck upon API response
function createDeck() {
  var ourReq = new XMLHttpRequest();
  var apiURL = "https://deckofcardsapi.com/api/deck/new/";

  ourReq.open("GET", apiURL, true);
  ourReq.addEventListener("load", function(){
    deckData = JSON.parse(ourReq.responseText);
    console.log(deckData);
    shuffleDeck(deckData.deck_id);
  });
  ourReq.send(null);
};

//shuffles deck and upon API response, calls drawHand if a hand is not already in progress
function shuffleDeck(deck_id) {
  var ourReq = new XMLHttpRequest();
  var apiURL = "https://deckofcardsapi.com/api/deck/" + deck_id + "/shuffle/";

  ourReq.open("GET", apiURL, true);
  ourReq.addEventListener("load", function(){
    deckData = JSON.parse(ourReq.responseText);
    if (handInProgress == false) {
      drawHand(deckData);
      handInProgress = true;
    }
  });
  ourReq.send(null);
};

//draws a new hand (5 cards) and updates the page with the drawn card images upon API response
function drawHand(deckObj) {
   //to ensure each hand has an equal chance of all cards, we must shuffle before each hand
   shuffleDeck(deckObj.deck_id);

   var ourReq = new XMLHttpRequest();
   var apiURL = "https://deckofcardsapi.com/api/deck/" + deckObj.deck_id + "/draw/?count=" + 5;

   ourReq.open("GET", apiURL, true);
   ourReq.addEventListener("load", function(){
     handData = JSON.parse(ourReq.responseText);
     document.getElementById("card1").src = handData.cards[0].image;
     document.getElementById("card2").src = handData.cards[1].image;
     document.getElementById("card3").src = handData.cards[2].image;
     document.getElementById("card4").src = handData.cards[3].image;
     document.getElementById("card5").src = handData.cards[4].image;
     document.getElementById("result").innerText = "You have: " + evaluateHand(handData, pair, flush, straight);
   });
   ourReq.send(null);
};

/*draws a single card to replace the card index passed, upon API response,
  updates handData object and updates card image to newly drawn card*/
function drawCard(deckObj, cardIndex) {
  //because we shuffle before each hand, should always be 47 cards available after inital 5 are dealt
  //this provides safety in event of error or unsucessful response when shuffling before hand
  if(deckObj.remaining < 1) {
    shuffleDeck(deckObj.deck_id);
  }
  var ourReq = new XMLHttpRequest();
  var apiURL = "https://deckofcardsapi.com/api/deck/" + deckObj.deck_id + "/draw/?count=" + 1;

  ourReq.open("GET", apiURL, true);
  ourReq.addEventListener("load", function(){
    handData.cards[cardIndex] = JSON.parse(ourReq.responseText).cards[0];
    deckData.remaining = JSON.parse(ourReq.responseText).remaining;

    var cardID = "card" + (cardIndex + 1);
    document.getElementById(cardID).src = handData.cards[cardIndex].image;
    document.getElementById("result").innerText = "You have: " + evaluateHand(handData, pair, flush, straight);
  });
  ourReq.send(null);
};

//discards the card passed to the pile name passed, then updates the discardData object to reflect current info
function discardCard(deckObj, pileName, cardCode) {
 //same request setup
 var ourReq = new XMLHttpRequest();
 //dynamically build URL using parameters passed, including card to discard
 var apiURL = "https://deckofcardsapi.com/api/deck/" + deckObj.deck_id + "/pile/" + pileName + "/add/?cards=" + cardCode;

 ourReq.open("GET", apiURL, true);
 ourReq.addEventListener("click", function(){
   discardData = JSON.parse(ourReq.responseText);
 });
 ourReq.send(null);
};

document.getElementById("discardButton").addEventListener("click", function(event) {
  var btn1 = document.getElementById("card1btn");
  var btn2 = document.getElementById("card2btn");
  var btn3 = document.getElementById("card3btn");
  var btn4 = document.getElementById("card4btn");
  var btn5 = document.getElementById("card5btn");
  if (btn1.style.backgroundColor == "red" && discardAvailable == true){
    discardCard(deckData, "discard", handData.cards[0].code);
    drawCard(deckData, 0);
    btn1.style.backgroundColor = "white";
  }
  if (btn2.style.backgroundColor == "red" && discardAvailable == true){
    discardCard(deckData, "discard", handData.cards[1].code);
    drawCard(deckData, 1);
    btn2.style.backgroundColor = "white";
  }
  if (btn3.style.backgroundColor == "red" && discardAvailable == true){
    discardCard(deckData, "discard", handData.cards[2].code);
    drawCard(deckData, 2);
    btn3.style.backgroundColor = "white";
  }
  if (btn4.style.backgroundColor == "red" && discardAvailable == true){
    discardCard(deckData, "discard", handData.cards[3].code);
    drawCard(deckData, 3);
    btn4.style.backgroundColor = "white";
  }
  if (btn5.style.backgroundColor == "red" && discardAvailable == true){
    discardCard(deckData, "discard", handData.cards[4].code);
    drawCard(deckData, 4);
    btn5.style.backgroundColor = "white";
  }
  discardAvailable = false;
  document.getElementById("discardButton").innerText = "Already Discarded\nGood Luck!";
});

//button to draw a new hand, if one is not already in progress, if one is, user is alerted
document.getElementById("newButton").addEventListener("click", function(event) {
  if (discardAvailable == false) {
    drawHand(handData);
    discardAvailable = true;
    document.getElementById("discardButton").innerText = "Discard Cards Selected";
  } else {
    window.alert("You must complete your current hand before drawing a new hand. Discard 0-5 cards, then draw a new hand.")
  }
});

//following is 5 buttons, all with the same response on click, but one for each of 5 cards in hand
//comments only on first button as rest is duplicative
document.getElementById("card1btn").addEventListener("click", function() {
  //set btn to card1btn element
  var btn = document.getElementById("card1btn");
  //if not already red, and discard hasn't occured yet, on click mark red
  //if discard has occured, no functionality until next hand
  if(btn.style.backgroundColor != "red" && discardAvailable == true) {
    btn.style.backgroundColor = "red";
  } else {
    //if already red, toggle back to white
    btn.style.backgroundColor = "white";
  }
});
document.getElementById("card2btn").addEventListener("click", function() {
  var btn = document.getElementById("card2btn");
  if(btn.style.backgroundColor != "red" && discardAvailable == true) {
    btn.style.backgroundColor = "red";
  } else {
    btn.style.backgroundColor = "white";
  }
});
document.getElementById("card3btn").addEventListener("click", function() {
  var btn = document.getElementById("card3btn");
  if(btn.style.backgroundColor != "red" && discardAvailable == true) {
    btn.style.backgroundColor = "red";
  } else {
    btn.style.backgroundColor = "white";
  }
});
document.getElementById("card4btn").addEventListener("click", function() {
  var btn = document.getElementById("card4btn");
  if(btn.style.backgroundColor != "red" && discardAvailable == true) {
    btn.style.backgroundColor = "red";
  } else {
    btn.style.backgroundColor = "white";
  }
});
document.getElementById("card5btn").addEventListener("click", function() {
  var btn = document.getElementById("card5btn");
  if(btn.style.backgroundColor != "red" && discardAvailable == true) {
    btn.style.backgroundColor = "red";
  } else {
    btn.style.backgroundColor = "white";
  }
});

//function which evaluates a hand (obj with array holding 5 cards) for pairs and pair combinations
function pair(handObj) {

  //vars to track highest single card count and its value
  var highestLikeKind = 0;
  var highestLikeVal;

  //var to track value of second pair, if 2 pair condition exists
  var secondPairVal = -1;

  //vars to track hand type condition
  var pair = false;
  var twoPair = false;
  var threeKind = false;
  var fourKind = false;
  var fullHouse = false;

  //now loop through each card, evaluating it against the others
  for (var x = 0; x < 5; x++){
    var numOfLike = 0;
    var likeVal = 0;
      for (var y = x + 1; y < 5; y++) {
        if(handObj.cards[x].value == handObj.cards[y].value)
          numOfLike++
          likeVal = handObj.cards[x].value;
      }
      //if pair found, check for possible higher value hand: two pair, or full house
      if (numOfLike == 1) {
        //if not other pair exists, record pair
        if (pair == false) {
          pair = true;
          highestLikeVal = likeVal;
          highestLikeKind = numOfLike;
        }
        //if pair already exists, record 2 pair condition
        if (pair == true && likeVal != highestLikeVal) {
          twoPair = true;
          if (likeVal > highestLikeVal) {
            secondPairVal = highestLikeVal
            highestLikeVal = likeVal;
            highestLikeKind = numOfLike;
          } else {
            secondPairVal = likeVal;
          }
        }
        //check if 3 kind already exists, record full house condition
        if (threeKind == true && likeVal != highestLikeVal) {
          fullHouse = true;
          secondPairVal = likeVal;
        }
      }
      //3 of kind found, check for possible higher value hand: full house
      if (numOfLike == 2) {
        if (pair == true && likeVal != highestLikeVal) {
          fullHouse = true;
          secondPairVal = highestLikeVal;
          highestLikeVal = likeVal;
          highestLikeKind = numOfLike;
        } else {
          threeKind = true;
          highestLikeVal = likeVal;
          highestLikeKind = numOfLike;
        }
      }
      //finally, if 4 of kind exists, record it
      if (numOfLike == 3) {
        fourKind = true;
        highestLikeVal = likeVal;
        highestLikeKind = numOfLike;
      }
    }
  if (fourKind == true)
    return "4 of a Kind - " + highestLikeVal + "s";
  else if (fullHouse == true)
    return "Full House - " + highestLikeVal + "s full of " + secondPairVal + "s";
  else if (threeKind == true)
    return "3 of a Kind - " + highestLikeVal + "s";
  else if (twoPair == true)
    return "Two pair - " + highestLikeVal + "s & " + secondPairVal + "s";
  else if (pair == true && twoPair == false)
    return "Pair of " + highestLikeVal + "s";
  else
    return "No winning hands"
};

//function which evaluates a hand (obj with array holding 5 cards) for a flush
function flush(handObj) {
  for (var x = 0; x < 1; x++){
    var flushChecker = 0;
    for (var y = x; y < 5; y++) {
      if (handObj.cards[0].suit == handObj.cards[y].suit)
        flushChecker++
    }
  }

  if (flushChecker >= 5) {
    return true;
  } else {
    return false;
  }
};
//function which evaluates a hand (obj with array holding 5 cards) for a straight (note: low ace not allowed in this game)
function straight(handObj) {
  var totalValue = 0;
  var cardValue = [];
  for (var x = 0; x < 5; x++){
    var val = handObj.cards[x].value;
    switch (val) {
      case "JACK": {
        totalValue += 11;
        cardValue.push(11);
        break;
      }
      case "QUEEN": {
        totalValue += 12;
        cardValue.push(12);
        break;
      }
      case "KING": {
        totalValue += 13;
        cardValue.push(13);
        break;
      }
      case "ACE": {
        totalValue += 14;
        cardValue.push(14);
        break;
      }
      default: {
        totalValue += parseInt(val);
        cardValue.push(val);
        break;
      }
    }
  };
  //calculate the average hand card value
  var averageValue = totalValue / 5;

  //bool to identify if straight condition exists
  var straight = true;
  //check if all cards are within abs(2) of the average
  for (var y = 0; y < 5; y++) {
    if (Math.abs(averageValue - cardValue[y]) > 2){
      straight = false;
    }
  }
  //verify that all cards are different so ex. hand [4 5 6 7 7] doesn't trigger straight event
  for (var x = 0; x < 5; x++) {
      for (var y = x + 1; y < 5; y ++) {
      //if for any card, it is same as another, cannot be straight
      if (cardValue[x] == cardValue[y]) {
        return "No Straight";
      }
    }
  }

  if (straight == true){
    return "Straight!";
  } else {
    return "No Straight";
  }
};

//higher order function which accepts three functions and an object holding a card array, returns best hand found
function evaluateHand(handObj, evalOne, evalTwo, evalThree) {
  var result = evalOne(handObj);
  var flush = evalTwo(handObj);
  var straight = evalThree(handObj);
  //return best hand found by three checker functions
  if (flush == true && straight == "No Straight") {
    return "Flush!";
  } else if (flush == true && straight == "Straight") {
    return "Straight Flush!";
  } else if (straight == "Straight!") {
    return straight;
  } else {
    return result;
  }
};
