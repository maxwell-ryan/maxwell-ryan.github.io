

//create and initialize a XMLHttpRequest
var ourDeck = new XMLHttpRequest();

//save the API URL for repeated use
var apiURL = "https://deckofcardsapi.com/api/deck/new/"

//initialize the request, using a GET request
ourDeck.open("GET", apiURL, false);
//now send the initalized request, NULL indicates that no other information is sent with it
ourDeck.send(null);

//when the API server responds, we expect it to return a DOMString, which we can parse into a object using the JSON.parse method
var deckResponse = JSON.parse(ourDeck.responseText);
deckResponse;

console.log(deckResponse);
