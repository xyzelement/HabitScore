

function makeDayButton(day) {
  moment.lang('en', {
  	        'calendar' : {
            'lastDay' : '[Yesterday]',
            'sameDay' : '[Today]',
            'lastWeek' : 'dddd',
            'nextWeek' : 'dddd',
            'sameElse' : 'dddd'
       }
  });
  return {text: "<b>" + day.format("MMM D")+"</b> " +day.calendar(), date: Meteor.utils.dateToKey(day)};
}

Template.days.buttons = function () {
  var out = [];
  for (var i=0; i<7; ++i){
    out.push( makeDayButton(moment().subtract('days', i) ) );
  }

  return out;
}

Template.days.events({'click ': function(event,template) {
  var date = event.target.getAttribute("data-id");  
  Session.set('lastUpdate', date );
}});