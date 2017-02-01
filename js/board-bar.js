/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var firebaseRef;
var cards = [];
var milestones = [];
var matchedData = {};
var canvasElement = document.getElementById("result");
var dayWidth = 0;
var today = new Date();

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
  var dayWidth = (window.innerWidth - 16) / 30;

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

  var daysBetweenMin = days_between(min, today);
  var daysBetweenMax = days_between(max, today);
  var daysBetweenBoth = days_between(max, min);
  console.log("days between both", daysBetweenBoth);
  var dayWidth = (window.innerWidth - 16) / 30;

  getBar.style.width = (dayWidth * daysBetweenBoth) + "px";
  getBar.style.left = (dayWidth * daysBetweenMin) + "px";

  console.log("Days between", daysBetweenMin, daysBetweenMax);

  //render milesstones in the bar
  for(x in milestones) {
    console.log('draw milestone');
    var d = new Date(milestones[x].date);
    var fromStart = days_between(min, d);
    var dot = document.createElement("div");
    dot.className = "milestone";
    getBar.appendChild(dot);
    dot.style.left = (fromStart * dayWidth) + "px";
    console.log(d, fromStart, dot, dot.style.left);
  }

};



function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = date1_ms - date2_ms;
  
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}