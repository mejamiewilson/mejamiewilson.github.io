/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

t.render(function(){

  

  return t.cards('id', 'name')
    .then(function(promiseResult) {
      console.log(promiseResult);
    })
    .then(function() {
      return t.get('card', 'public', 'milestones');
    })
    .then(function(results) {
      console.log("get milestones from cards results", results);
    });
  
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
});
