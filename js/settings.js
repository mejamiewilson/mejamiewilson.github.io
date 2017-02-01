/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var addMilestoneSelector = document.getElementById('js-add-milestone');
var milestonesElementSelector = document.getElementById('milestones');

// var fruitSelector = document.getElementById('fruit');
// var vegetableSelector = document.getElementById('vegetable');

t.render(function(){
  return Promise.all([
    t.get('card', 'private', 'milestones'),
    t.get('board', 'shared', 'fruit'),
    t.get('board', 'private', 'vegetable')
  ])
  .spread(function(savedMilestones, savedFruit, savedVegetable){
    //set the values
    if(savedMilestones) {
      milestonesElementSelector.innerHTML = JSON.stringify(savedMilestones);
    }
    // if(savedFruit && /[a-z]+/.test(savedFruit)){
    //   fruitSelector.value = savedFruit;
    // }
    // if(savedVegetable && /[a-z]+/.test(savedVegetable)){
    //   vegetableSelector.value = savedVegetable;
    // }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

var milestoneRenderer = function() {
  var div = document.createElement("div");
  div.innerHTML = "New Milestone Form";
  return div;
};

addMilestoneSelector.addEventListener('click', function() {
  console.log("Appending Child");
  //milestonesElementSelector.appendChild(milestoneRenderer());
  milestonesElementSelector.innerHTML = "New Milestone";
});

document.getElementById('save').addEventListener('click', function(){
  // return t.set('board', 'private', 'vegetable', vegetableSelector.value)
  // .then(function(){
  //   return t.set('board', 'shared', 'fruit', fruitSelector.value);
  // })
  // .then(function(){
    return t.closePopup();
  //})
});