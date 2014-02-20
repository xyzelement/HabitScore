Router.configure({
  layoutTemplate: 'layout'
});


//EMTODO: seems like not using the main template only names
// ones is not kosher, though works.
Router.map(function () {

  this.route('add', {
    template: 'habitSelectionTemplate',
    yieldTemplates: {
      //'days' : {to: 'left'},
      'edit': {to: 'right'}
    }    
  });

  this.route('debug', {});

  this.route('today', {
    path: '/',
    template: 'days',
    yieldTemplates: {
      //'days' : {to: 'left'},
      'today': {to: 'right'}
    }
  });
});

Handlebars.registerHelper('TabClassName', function (route) {
  return Router.current().route.name === route ? "active" : "";
});




function trans(document) {
  //document.badges = Badges.parse(document.badges);
  return document;
}

Habits = new Meteor.Collection("habits", {transform: trans}); 



Meteor.startup(function(){
 Session.set('lastUpdate', Meteor.utils.dateToKey(moment()) );
});


















