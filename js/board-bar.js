/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var firebaseRef;
var cards = [];

t.render(function(){

  firebaseRef = firebase.database().ref('cards/');
  firebaseRef.on('value', function(snapshot) {
    document.getElementById("result").innerHTML = JSON.stringify(snapshot.val());
  });  
  
  return t.cards('id', 'name')

    then(function(promiseResult) {
      cards = promiseResult;
      document.getElementById("result").innerHTML = document.getElementById("result").innerHTML + JSON.stringify(promiseResult);
      console.log(promiseResult);
    });

  
});
