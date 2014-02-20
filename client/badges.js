

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
