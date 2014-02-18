//EMTODO:  it should not be making any trips to the server as the 
// data should already be in minimongo on the client. That said, 
// you might want to look into global helpers in handlerbars if you 
//find yourself with lots of repeating code.
Template.today.habits = function () {
  return Habits.find({});
};

//EMTODO: .test ??
Template.today.events({'change .test': function(event, template) {
  event.preventDefault();
  var box = template.find("input[name="+this._id+"]");
  var date= Session.get('lastUpdate');

  if (box.checked) {
    //EMTODO: Would be nice to treat this as a "set" to avoid 
    //adding the same date twice.
    Habits.update({_id: this._id}, {$push: {dates: date}});
  } else {
    Habits.update({_id: this._id}, {$pull: {dates: date}});
  }
}});


Handlebars.registerHelper('habit', function(context) {
  var done = ($.inArray(Session.get("lastUpdate"), context.dates) > -1);
  var out = "";

  out += '<div class="panel panel-default"><div class="panel-body">';
  out += '<div class="checkbox"><label>';
  out += '<input type="checkbox" class="test" name="' + context._id  + '" ';
  if(done) { out += "checked" };
  out += '><h3>' + context.name;
  out += ' ' + getBadge(context);
  out += '</h3></input></label><div>';  

  out += "</div></div>"
  return out;
});
 




function getBadge(habit, which) {
  var date  = Session.get('lastUpdate');
  var badge = habit.badges.getAttainment(date, habit.dates);  
  if (badge === "info") { return ""; }
  return '<span class="label label-'+badge+'">'+badge+'</span>';
}