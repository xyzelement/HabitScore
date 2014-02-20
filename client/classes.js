/*
Use cases:
	Coffee: Success: 	Did it all days last week
			Warning: 	Did not do it yesterday
			Danger:  	Did not do it two days in a row		
	Vacuum: Success:    Did it in the last week
			Warning:    Did not do in over a week
			Danger:     Did not do it in over two weeks
	Yoga:   Success:    1 out of the last 3 days            : 1+/3
			Warning:    Less than 1 out of last 3 days      : fewer than 1/3
			Danger:     Less than 1 out of the last 5 days  : fewer than 1/5

	Evaluation: worst to best
*/


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
    return $.grep(a, function(i) { return $.inArray(i, b) > -1; });
};

Badge = function(type, active, daysX, daysY) {
	this.type   = type;
	this.active = true;
	this.daysX  = daysX;
	this.daysY  = daysY;
	//console.log("Badge:", this.type, active, this.daysX, this.daysY);

	this.attained = function (date, dates) {
		if (!this.active) { return false; }
		var inter = $.arrayIntersect(dates, 
    					getLastXdaysPriorTo(this.daysY, date));		

		var daysDone = inter.length;
		if (this.type === "success") {		
			return daysDone >= this.daysX;
		} else {			
			return daysDone < this.daysX;
		}
	}
}

Badge.default = function(type) {
	return new Badge(type, false, 1,2);
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
		return this[type];
	}

	this.getAttainment = function(date, dates) {
		if (this.danger.attained(date, dates))  { return "danger";  }		
		if (this.warning.attained(date, dates)) { return "warning"; }		
		if (this.success.attained(date, dates)) { return "success"; }		
		return "info";
	}
}

Badges.default = function() {
	return new Badges(Badge.default("success"), 
					  Badge.default("warning"), Badge.default("danger"));
}

Badges.parse = function(data) {
	var x = $.extend(new Badges(), {
		success: Badge.parse(data.success),
		warning: Badge.parse(data.warning),
		danger : Badge.parse(data.danger)
	});
	return x;
}

Habit = function(){
	this.badges =  Badges.default();
}