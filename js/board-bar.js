/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var firebaseRef;
var cards = [];
var milestones = [];
var matchedData = {};
var canvasElement = document.getElementById("result");
var dayWidth = 0;

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
  var dayWidth = window.innerWidth - 16;

};

var render = function() {
  console.log("Matched Data", matchedData);
  calculateFrame();
  Object.keys(matchedData).forEach(function(cardId) {
    renderBar(cardId, matchedData[cardId]);
  })
};

var renderBar = function(cardId, barObj) {

  var getBar = document.getElementById("milestone-bar-" + cardId);

  if(!getBar) {
    getBar = document.createElement("div");
    getBar.id = "milestone-bar-" + cardId;
    getBar.className = "milestone-bar";
    canvasElement.appendChild(getBar);
  }

  getBar.innerHTML = barObj.card.name;

  //get earliest date
  //get last date

  var milestones = barObj.milestone.milestones;
  var min = Infinity, max = -Infinity, x;
  for( x in milestones) {
      var d = new Date(milestones[x].date);
      if( d < min) min = d;
      if( d > max) max = d;
  }

  console.log("Milestone, min max", min, max);



};