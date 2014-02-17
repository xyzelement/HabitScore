/*
Use cases:
	Coffee: Success: 	Did it all days last week
			Warning: 	Did not do it yesterday
			Danger:  	Did not do it two days in a row		
	Vacuum: Success:    Did it in the last week
			Warning:    Did not do in over a week
			Danger:     Did not do it in over two weeks
	Yoga:   Success:    1 out of the last 3 days
			Warning:    Less than 1 out of last 3 days
			Danger:     Less than 1 out of the last 5 days

	Evaluation: worst to best
*/

Badge = function(type, active, daysX, daysY) {
	this.type   = type;
	this.active = true;
	this.daysX  = daysX;
	this.daysY  = daysY;
	//console.log("Badge:", this.type, active, this.daysX, this.daysY);
}

Badge.parse = function(data){		
	return $.extend(new Badge(), data);
}

Badges = function(success, warning, danger){
	this.success = success;
	this.warning = warning;
	this.danger  = danger;
	//console.log ("Badges:", this.success, this.warning, this.danger);

	this.getBadge = function(type) {
		if(!this[type]) {
			console.log("Create default badge for", type);
			this[type] = new Badge(type, false,10,11); //EMTODO: change defaults
		}
		return this[type];
	}
}

Badges.parse = function(data) {
	var x = $.extend(new Badges(), {
		success: Badge.parse(data.success),
		warning: Badge.parse(data.warning),
		danger : Badge.parse(data.danger)
	});
	return x;
}

function makeDaysSelector(id, selected) {
  out =  '<select id="'+id+'">';
  for (var i=1; i<Meteor.utils.maxDaysDisplayed; ++i) {
    out += '<option' + ((selected == i)?' selected':'') +'>'+i+'</option>';
  }
  return out + '</select>';
}


function makeBadgeItem(type) {
	var habit = Session.get("currentlyEdited");
	if (!habit) return "";
	habit.badges = Badges.parse(habit.badges); //EMTODO: this feels dirty?

	var text="";
	switch(type) {
		case "success": text = "Success!"; break;
		case "warning": text = "Warning!"; break;
		case "danger":  text = "Danger!";  break;
		default: console.log("Unknown type:", type);
	}

	return '<div class="panel panel-'+type+'">'
		  +'<div class="panel-heading"><h3 class="panel-title">'+type+' badge</h3></div>'
		  + '<div class="panel-body">'
          + text
          + makeDaysSelector(type+"DaysX", habit.badges.getBadge(type).daysX) + ' out of'
          + makeDaysSelector(type+"DaysY", habit.badges.getBadge(type).daysY) + ' days.'
          + '</div></div>';
}

function makeBadgeItems() {
	return makeBadgeItem("success")+makeBadgeItem("warning")+makeBadgeItem("danger");
}

Handlebars.registerHelper('badgeItems', function(type) {
	return makeBadgeItems();
});


function grabBadgeValues(type) {
	var days1=     $('#'+type+'DaysX').val();
    var days2=     $('#'+type+'DaysY').val();    	
    return new Badge(type, true, days1, days2);
}

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

  
  //EMTODO: can this be a single DB op?
  Habits.update({_id: habit._id}, {$set: {name: habit.name}});
  Habits.update({_id: habit._id}, {$set: {badges: habit.badges}});

  Session.set("currentlyEdited",habit);
}});
