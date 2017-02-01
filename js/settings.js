/* global TrelloPowerUp */

//to do 
// edit form
// delete
// resize on cancel

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var addMilestoneSelector = document.getElementById('js-add-milestone');
var milestonesElementSelector = document.getElementById('milestones');

var milestonesArray = [];
var tempMilestonesArray = [];

t.render(renderMilestones);

function renderMilestones() {
  return Promise.all([
    t.get('card', 'private', 'milestones')
  ])
  .spread(function(savedMilestones){
    
    milestonesArray = [];
    
    if(savedMilestones) {
      milestonesArray = JSON.parse(savedMilestones);
    }

    for(var x = 0; x < tempMilestonesArray.length; x++) {
      milestonesArray.push(tempMilestonesArray[x]);
    }
    tempMilestonesArray = [];

    for(var i = 0; i < milestonesArray.length; i++) {

      var milestone = milestonesArray[i];

      alert("milestone-" + milestone.id);

      var renderTarget = document.getElementById("milestone-" + milestone.id);

      if(!renderTarget) {

        alert("no render target");

        var mDiv = document.createElement("div");
        mDiv.id = "milestone-" + milestone.id;

        mDiv.appendChild(milestoneRenderer(milestone));

        milestonesElementSelector.appendChild(mDiv);

      } else {

        alert("render target");

        milestonesElementSelector.innerHTML = "";
        milestonesElementSelector.appendChild(milestoneRenderer(milestone));

      }

    }
  
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
}

function milestoneRenderer(milestone) {
  var wrapper = document.createElement("div");
  var name = document.createElement("div");
  name.innerHTML = milestone.name;
  var date = document.createElement("div");
  date.innerHTML = milestone.date;
  var link = document.createElement("a");
  link.innerHTML = "Edit";
  wrapper.appendChild(name);
  wrapper.appendChild(date);
  wrapper.appendChild(link);
  return wrapper;
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
    date: milestoneDate.value,
    id: generateUIDNotMoreThan1million()
  };

  milestoneName.value = "";
  milestoneDate.value = ""; 

  tempSaveMilestone(saveValues);

  close();

});

var tempSaveMilestone = function(milestone) {
  tempMilestonesArray.push(milestone);
  renderMilestones();
}

document.getElementById('save').addEventListener('click', function(){
  //backfill Ids. 
  // for(var i = 0; i < milestonesArray.length; i++) {
  //   if(!milestonesArray[i].id) {
  //     milestonesArray[i].id = generateUIDNotMoreThan1million();
  //   }
  // }
  return t.set('card', 'private', 'milestones', JSON.stringify(milestonesArray))
  .then(function(){
    return t.closePopup();
  })
});

function generateUIDNotMoreThan1million() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}
