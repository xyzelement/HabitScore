Template.edit.events({'click .edit-save': function(event,template) {
  //EMTODO: input validation 

  var habit        = $('#edit-habit').val();
  
  var badges = {}
  badges.good         = $('#edit-good-badge').val();
  badges.good_days1   = $('#edit-good-days1').val();
  badges.good_days2   = $('#edit-good-days2').val();
  
  badges.bad         = $('#edit-bad-badge').val();  
  badges.bad_days1   = $('#edit-bad-days1').val();
  badges.bad_days2   = $('#edit-bad-days2').val();
  
  console.log(JSON.stringify(badges));
  
  var id = Session.get("currentlyEdited")._id;
  Habits.update({_id: id}, {$set: {name: habit}});
  Habits.update({_id: id}, {$set: {badges: badges}});
}});