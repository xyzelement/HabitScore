Habits = new Meteor.Collection("habits");

Meteor.startup(function() {

    return Meteor.methods({

      removeAll: function() {

        return Habits.remove({});

      }

    });

  });
