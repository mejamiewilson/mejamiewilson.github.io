/* global TrelloPowerUp */

//to do 
// edit form
// delete
// resize on cancel

var database = firebase.database();
var milestones = {};
var cardId;
var firebaseRef;
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.card('id', 'name', 'url').then(function(promiseResult){
  alert("FOUND THE ID", id);
  init(promiseResult.id);
});


var init = function(id) {
  alert(id);
  console.log("Found the ID", id);
  cardId = id;
  firebaseRef = firebase.database().ref('cards/' + id + '/milestones');
  firebaseRef.on('value', function(snapshot) {
    renderMilestones(snapshot.val());
  });
}

var addMilestoneSelector = document.getElementById('js-add-milestone');
var milestonesElementSelector = document.getElementById('milestones');

var milestonesArray = [];
var tempMilestonesArray = [];

//t.render(renderMilestones);

function renderMilestones(_milestones) {

  console.log(_milestones);

  Object.keys(_milestones || {}).forEach(function(key) {
    var m = _milestones[key];
    var slug = "milestone-" + key;
    milestones[key] = m;

    //render
    var renderTarget = document.getElementById(slug);
    console.log(renderTarget, slug);

    if(!renderTarget) {

      var mDiv = document.createElement("div");
      mDiv.id = slug;
      mDiv.className = "milestone-element";

      mDiv.appendChild(milestoneRenderer(m));

      milestonesElementSelector.appendChild(mDiv);

    } else {

      milestonesElementSelector.innerHTML = "";
      milestonesElementSelector.appendChild(milestoneRenderer(m));

    }


  });
      
  return 
    t.sizeTo('#content')
    .done();

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
  
  //renderMilestones();
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

  firebase.database().ref('cards/' + cardId + '/milestones/' + saveValues.id).set({
      name: saveValues.name,
      date: saveValues.date
    });

  close();

});

document.getElementById('close').addEventListener('click', function(){

  return t.closePopup();

});

/* HELPERS */

function generateUIDNotMoreThan1million() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}
