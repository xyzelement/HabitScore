Template.edit.events({'click .edit-save': function(event,template) {
  //EMTODO: input validation 

  var habit        = $('#edit-habit').val();
  
  var badges = {}

  badges.use_good_badge = $('#use_good_badge').attr('checked');
  badges.good           = $('#edit-good-badge').val();
  badges.good_days1     = $('#edit-good-days1').val();
  badges.good_days2     = $('#edit-good-days2').val();
  
  badges.use_bad_badge  = $('#use_bad_badge').attr('checked');
  badges.bad            = $('#edit-bad-badge').val();  
  badges.bad_days1      = $('#edit-bad-days1').val();
  badges.bad_days2      = $('#edit-bad-days2').val();
  
  console.log(JSON.stringify(badges));
  
  var id = Session.get("currentlyEdited")._id;
  Habits.update({_id: id}, {$set: {name: habit}});
  Habits.update({_id: id}, {$set: {badges: badges}});
}});

Template.edit.selected = function () {
  return Session.get("currentlyEdited");
};

Handlebars.registerHelper('habit_checkbox', function(habit, which) {
  var label;
  var checked;


  switch(which) {
    case "good":
      label   = "Award a badge for performing this habbit";
      checked = habit && habit.badges && habit.badges.use_good_badge ? " checked" : "";
      id      = "use_good_badge";
      break;
    case "bad" :
      label   = "badge of SHAME!";
      checked = habit && habit.badges && habit.badges.use_bad_badge ? " checked" : "";
      id      = "use_bad_badge";
      break;   
    default:
      console.log("Unknown which:"+which+":");
  }
  
  return '<div class="checkbox"><label><input type="checkbox" id="'
          +id+'"'+checked+'>'+label+'</label></div>'
});

Handlebars.registerHelper('days_selector', function(id, selected) {

  out =  '<select id="'+id+'">';
  for (var i=1; i<8; ++i) {
    out += '<option' + ((selected == i)?' selected':'') +'>'+i+'</option>';
  }
  out += '</select>';

  return out;
});