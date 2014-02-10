Router.configure({
  layoutTemplate: 'layout'
});


//EMTODO: seems like not using the main template only names
// ones is not kosher, though works.
Router.map(function () {

  this.route('add', {
    yieldTemplates: {
      //'days' : {to: 'left'},
      'edit': {to: 'right'}
    }    
  });

  this.route('debug', {});

  this.route('today', {
    path: '/',
    template: 'days',
    yieldTemplates: {
      //'days' : {to: 'left'},
      'today': {to: 'right'}
    }
  });
});

Handlebars.registerHelper('TabClassName', function (route) {
  return Router.current().route.name === route ? "active" : "";
});






Habits = new Meteor.Collection("habits"); 

Handlebars.registerHelper('habit', function(context) {
  var done = ($.inArray(Session.get("lastUpdate"), context.dates) > -1);
  out = '<div class="list-group-item' + (done? ' list-group-item-success': '')+'">';
  out += '<div class="checkbox"><label>';
  out += '<input type="checkbox" class="test" name="' + context._id  + '" ';
  if(done) { out += "checked" };
  out += '>' + context.name +'</input>';
  if (done) { out += "☺"; }
  out += ' <span class="badge">'+context.dates.length+'</span>';
  out += '</label><div>';
  out += "</div>"
  return out;
});
 

Handlebars.registerHelper('dayButton', function(context) {
  var active = "";
  if (context.date == Session.get('lastUpdate')) { active =" active"; };
  return '<a href="#" class="list-group-item '+active+'" data-id="'+context.date+'">'+context.text+'</a>'
});

function dateToKey(date) {
  return date.format("YYYYMMDD");
}

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

  return {text: "<b>" + day.format("MMM D")+"</b> " +day.calendar(), date: dateToKey(day)};
}

Template.days.buttons = function () {
  var out = [];
  for (var i=0; i<7; ++i){
    out.push( makeDayButton(moment().subtract('days', i) ) );
  }

  console.log(out);
  return out;
}

Template.days.events({'click ': function(event,template) {
  var date = event.target.getAttribute("data-id");  
  Session.set('lastUpdate', date );
}});

Meteor.startup(function(){
 Session.set('lastUpdate', dateToKey(moment()) );
});

//EMTODO:  it should not be making any trips to the server as the 
// data should already be in minimongo on the client. That said, 
// you might want to look into global helpers in handlerbars if you 
//find yourself with lots of repeating code.
Template.today.habits = function () {
  return Habits.find({});
};

Template.add.habits = function () {
  return Habits.find({});
};

var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {        
        cancel.call(this, evt);  // escape = cancel

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};



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


Template.add.events(okCancelEvents('#add-habit', {
    ok: function (text, evt) {
      var id = Habits.insert({name: text, dates: []});      
      evt.target.value = "";
    }
}));


Template.add.events({'click .edit-selector': function(event,template) {
        Session.set("currentlyEdited", this);
}});

Template.add.events({'click .edit-save': function(event,template) {
  //EMTODO: input validation      
  var new_name = $('#edit-name').val();
  var id       = Session.get("currentlyEdited")._id;
  Habits.update({_id: id}, {$set: {name: new_name}});
}});



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

Handlebars.registerHelper('currentlyEdited', function(context) {
  var x = Session.get("currentlyEdited");
  if (!x) {
    return "nada!";
  } else {
    out  = '<input type="text" id="edit-name" value="'+x.name+'" />';
    out += '<a href="#" class="edit-save">Save</a>'
    return out;
  }
});