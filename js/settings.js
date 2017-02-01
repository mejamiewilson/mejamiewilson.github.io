/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var addMilestoneSelector = document.getElementById('js-add-milestone');
var milestonesElementSelector = document.getElementById('milestones');

var milestonesArray = [];

t.render(renderMilestones);

function renderMilestones() {
  return Promise.all([
    t.get('card', 'private', 'milestones')
  ])
  .spread(function(savedMilestones){
    
    alert(savedMilestones);
    if(savedMilestones) {
      alert("Parsing");
      milestoneArray = JSON.parse(savedMilestones);
      alert(milestoneArray);
    }
    milestonesElementSelector.innerHTML = JSON.stringify(milestonesArray);
  
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
}


function close() {

  document.getElementById("new-milestone-form").style.display = "none";
  document.getElementById("js-add-milestone").style.display = "block";

}

addMilestoneSelector.addEventListener('click', function() {
  
  renderMilestones();
  document.getElementById("new-milestone-form").style.display = "block";
  document.getElementById("js-add-milestone").style.display = "none";

});

document.getElementById("js-cancel-new-milestone").addEventListener('click', close);

document.getElementById("new-milestone-form-save").addEventListener('click', function() {

  var milestoneName = document.getElementById("new-milestone-form-name");
  var milestoneDate = document.getElementById("new-milestone-form-date");

  var saveValues = {
    name: milestoneName.value,
    date: milestoneDate.value
  };

  milestoneName.value = "";
  milestoneDate.value = ""; 

  tempSaveMilestone(saveValues);

  close();

});

var tempSaveMilestone = function(milestone) {
  milestonesArray.push(milestone);
  renderMilestones();
}

document.getElementById('save').addEventListener('click', function(){
  console.log(JSON.stringify(milestonesArray));
  return t.set('card', 'private', 'milestones', JSON.stringify(milestonesArray))
  .then(function(){
    return t.closePopup();
  })
});