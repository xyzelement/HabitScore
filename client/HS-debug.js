Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});


Template.debug.habits = function () {
  return Habits.find({});
};

Template.debug.events({
    'click .dropAll': function(e, t){
      Meteor.call('removeAll');
    }
 })
