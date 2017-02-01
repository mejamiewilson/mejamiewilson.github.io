/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var firebaseRef;

t.render(function(){

  firebaseRef = firebase.database().ref('cards/');
  firebaseRef.on('value', function(snapshot) {
    document.getElementById("result").innerHTML = JSON.stringify(snapshot.val());
  });  

  
});
