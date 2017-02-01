/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var firebaseRef;
var cards = [];
var milestones = [];
var matchedData = {};
var canvasElement = document.getElementById("result");

t.render(function(){

  firebaseRef = firebase.database().ref('cards/');
  firebaseRef.on('value', function(snapshot) {
    milestones = snapshot.val();
    dataMatch();
  });  
  
  return t.cards('id', 'name').
    then(function(promiseResult) {
      cards = promiseResult;
      dataMatch();
    });
  
});

//data match
var dataMatch = function() {

  if(milestones.length !== 0 && cards.length !== 0) {

    console.log("Starting to card match");

    cards.forEach(function(card) {

      if(milestones[card.id]) {
        matchedData[card.id] = {
          milestone: milestones[card.id],
          card: card
        };
      }

    });

    console.log("Matched data to render");
    render();

  }

};

var calculateFrame = function() {

  var barHeight = 30;
  var height = ((Object.keys(matchedData).length + 1) * (30 + 8)) - 8;
  canvasElement.style.height = height + "px";

};

var render = function() {
  console.log("Matched Data", matchedData);
  calculateFrame();
  Object.keys(matchedData).forEach(function(cardId) {
    renderBar(cardId, matchedData[cardId]);
  })
};

var renderBar = function(cardId, barObj) {

  console.log("Render Bar", cardId);

  var getBar = document.getElementById("milestone-bar-" + cardId);

  if(!getBar) {
    getBar = document.createElement("div");
    getBar.id = "milestone-bar-" + cardId;
    bagetBar.className = "milestone-bar";
    canvasElement.appendChild(getBar);
  }

  getBar.innerHTML = barObj.card.name;



};