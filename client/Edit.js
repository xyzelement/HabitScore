


Template.edit.events({'click .edit-delete': function(event,template) {
  //EMTODO: confirm dialog!
  var habit = Session.get("currentlyEdited");
  Habits.remove({_id: habit._id});
  Session.set("currentlyEdited",null);
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

