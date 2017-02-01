/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var firebaseRef;
var cards = [];
var milestones = [];
var matchedData = {};
var canvasElement = document.getElementById("result");
var dayGridElement = document.getElementById("day-grid");
var scroller = document.getElementById('scroller');
var content = document.getElementById('content');
var dayWidth = 0;
var today = new Date();
var shortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

t.render(function(){

  firebaseRef = firebase.database().ref('cards/');
  firebaseRef.on('value', function(snapshot) {
    milestones = snapshot.val();
    dataMatch();
  });  
  
  return t.cards('id', 'name', 'labels').
    then(function(promiseResult) {
      cards = promiseResult;
      console.log(promiseResult, "CARDS FETCHED");
      dataMatch();
    });
  
});

//data match
var dataMatch = function() {

  if(milestones.length !== 0 && cards.length !== 0) {

    cards.forEach(function(card) {

      if(milestones[card.id]) {
        matchedData[card.id] = {
          milestone: milestones[card.id],
          card: card
        };
      }

    });

    render();

  }

};

var calculateFrame = function() {

  var barHeight = 30;
  var height = ((Object.keys(matchedData).length + 1) * (30 + 8)) - 8;
  canvasElement.style.height = height + "px";
  dayWidth = (window.innerWidth - 16) / 30;

  scroller.style.width = (dayWidth * 51) + "px";
  dayGridElement.style.width = (dayWidth * 51) + "px";
  content.scrollLeft = (dayWidth * 7 * -1);
  canvasElement.style.width = (dayWidth * 51) + "px";


};

var render = function() {
  calculateFrame();
  renderCalendar();
  Object.keys(matchedData).forEach(function(cardId) {
    renderBar(cardId, matchedData[cardId]);
  });
};

var renderCalendar = function() {
  for(var i = -7; i < 44; i++) {
    var dayEl = document.createElement("div");
    dayEl.className = "day-slot";
    dayEl.style.width = (dayWidth) + "px";
    dayEl.style.height = "100%";
    var result = new Date();
    result.setDate(result.getDate() + i);
    dayEl.innerHTML = result.getDate() + ' ' + shortMonth[result.getMonth()];
    if(result.getDay() === 5 || result.getDay() === 6) {
      dayEl.className = "day-slot weekend";
    }
    var today = new Date();
    if(result.getDate() +":"+result.getMonth() === today.getDate()+":"+today.getMonth()) {
      dayEl.className += " today";
    }
    dayGridElement.appendChild(dayEl);
  }
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

  var start = new Date();
  start.setDate(start.getDate() - 7);

  var daysBetweenMin = days_between(min, start);
  var daysBetweenMax = days_between(max, start);
  var daysBetweenBoth = days_between(max, min);
  var dayWidth = (window.innerWidth - 16) / 30;

  getBar.style.width = (dayWidth * (daysBetweenBoth + 1)) + "px";
  getBar.style.left = (dayWidth * (daysBetweenMin + 1)) + "px";

  //render milesstones in the bar
  for(x in milestones) {
    var d = new Date(milestones[x].date);
    var fromStart = days_between(d, min);
    var dot = document.createElement("div");
    dot.className = "milestone";
    dot.innerHTML = milestones[x].name;
    getBar.appendChild(dot);
    dot.style.left = (((fromStart * dayWidth) - 5) + (dayWidth / 2) - 5) + "px";
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

