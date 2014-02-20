


Template.habitSelectionTemplate.events({'click .add-item': function(event,template) {
  Session.set("currentlyEdited", new Habit());
}});

Template.edit.events({'click .edit-delete': function(event,template) {
  //EMTODO: confirm dialog!
  var habit = Session.get("currentlyEdited");
  Habits.remove({_id: habit._id});
  Session.set("currentlyEdited",null);
}});


function grabBadgeValues(type) {
  var days1=     $('#'+type+'DaysX').val();
  var days2=     $('#'+type+'DaysY').val();     
  return new Badge(type, true, days1, days2);
}

//EMTODO: this needs to be somewhere else
Template.edit.events({'click .edit-save-badges': function(event,template) {

  var habit = Session.get("currentlyEdited");

  if(!habit) {
    alert("You gotta be editing something");
    return;
  }

  habit.name   = $('#edit-habit').val();
  habit.badges = new Badges(grabBadgeValues("success"),
              grabBadgeValues("warning"),
              grabBadgeValues("danger"));

  
  if (habit._id){
    Habits.update({_id: habit._id}, habit);
  }else {
    var id = Habits.insert(habit);
    habit._id = id;
  }
  
  Session.set("currentlyEdited",habit);
}});


















Template.edit.selected = function () {
  return Session.get("currentlyEdited");
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

