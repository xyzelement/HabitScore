


Template.edit.events({'click .edit-save': function(event,template) {
  //EMTODO: input validation 


  var habit = Session.get("currentlyEdited");
  habit.name        = $('#edit-habit').val();
  
  habit.badges = {good: 
                    { use:       $('#use_good_badge').attr('checked'),
                      name:      $('#edit-good-badge').val(),
                      days1:     $('#edit-good-days1').val(),
                      days2:     $('#edit-good-days2').val()
                    },
                  bad: 
                    { use:       $('#use_bad_badge').attr('checked'),
                      name:      $('#edit-bad-badge').val(),
                      days1:     $('#edit-bad-days1').val(),
                      days2:     $('#edit-bad-days2').val()
                    }
                  };
  
  //EMTODO: can this be a single DB op?

  Habits.update({_id: habit._id}, {$set: {name: habit.name}});
  Habits.update({_id: habit._id}, {$set: {badges: habit.badges}});

  Session.set("currentlyEdited",habit);
}});

Template.edit.selected = function () {
  var sel = Session.get("currentlyEdited");
  return sel;
};

Handlebars.registerHelper('habit_checkbox', function(habit, which) {
  var label;
  var checked;


  switch(which) {
    case "good":      
      checked = habit && habit.badges && habit.badges.good.use ? " checked" : "";
      label   = "Badge of Awesome!";
      id      = "use_good_badge";
      break;
    case "bad" :
      checked = habit && habit.badges && habit.badges.bad.use ? " checked" : "";
      label   = "Badge of Shame!";      
      id      = "use_bad_badge";
      break;   
    default:
      console.log("Unknown which:"+which+":");
  }

  return '<div class="checkbox"><label><input type="checkbox" id="'
          +id+'"'+checked+'>'+label+'</label></div>'
});

