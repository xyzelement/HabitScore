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
  out = '<div class="list-group-item' + (done? ' list-group-item-success': '')+'">';
  out += '<div class="checkbox"><label>';
  out += '<input type="checkbox" class="test" name="' + context._id  + '" ';
  if(done) { out += "checked" };
  out += '>' + context.name +'</input>';
  if (done) { out += "☺"; }
  //out += makeBadge(context, "good");
  //out += makeBadge(context, "bad");
  out += '</label><div>';
  out += "</div>"

  return out;
});
 


function getLastXdaysPriorTo(x, prior_to) {  
  var out = [];
  for (var i=0; i<x; ++i){
    var prior_to_date = Meteor.utils.keyToDate(prior_to);
    var subtracted    = prior_to_date.subtract('days', i);    
    out.push( Meteor.utils.dateToKey(subtracted));
  }
  return out;
}

$.arrayIntersect = function(a, b) {
    return $.grep(a, function(i) {
        return $.inArray(i, b) > -1;
    });
};

function makeBadge(habit, which) {

  var badge = habit.badges[which];
  if (!badge.use) {
    return "";
  }


  var date= Session.get('lastUpdate');

  var out = "";  
  var inter = $.arrayIntersect(habit.dates, 
    getLastXdaysPriorTo(badge.days2, date)).length;
  

  if (which === "good" && inter >= badge.days1) {
    out += ' <span class="label label-success">'+badge.name+'</span>';
  }
  if (which === "bad" && inter <= badge.days1) {
    out += ' <span class="label label-danger">'+badge.name+'</span>';
  }  
  return out;
}