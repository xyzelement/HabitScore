Router.configure({
  layoutTemplate: 'layout'
});


//EMTODO: seems like not using the main template only names
// ones is not kosher, though works.
Router.map(function () {

  this.route('add', {
    //yieldTemplates: {'add': {to: 'left'} }
  });

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


function dateToDbKey() {
  return moment($('#picker').datepicker('getDate')).format("YYYYMMDD");
}

Handlebars.registerHelper('habit', function(context) {
  //return "hello";
  var done = ($.inArray(Session.get("lastUpdate"), context.dates) > -1);
  out = '<div class="list-group-item' + (done? ' list-group-item-success': '')+'">';
  out += '<div class="checkbox"><label>';
  out += '<input type="checkbox" class="test" name="' + context._id  + '" ';
  if(done) { out += "checked" };
  out += '>' + context.name +'</input>';
  if (done) { out += "☺"; }
  out += "</label><div>";
  out += "</div>"
  return out;
});
 

Meteor.startup(function() {
  $('#picker').datepicker({
      format: "M d, yyyy, D",
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      todayHighlight: true,
  });
  $('#picker').datepicker('setDate', new Date());
  $('#picker').datepicker().on("changeDate", function(e){
        Session.set('lastUpdate', dateToDbKey() );
  });  
  Session.set('lastUpdate', dateToDbKey() );
});


function moveDatePicker(days){
  var date1 = $('#picker').datepicker('getDate');
  var date = new Date( Date.parse( date1 ) ); 
  date.setDate( date.getDate() + days );
  $('#picker').datepicker('setDate', date );
}

Template.days.events({'click #next_date': function()     { moveDatePicker(1);  }});
Template.days.events({'click #previous_date': function() { moveDatePicker(-1); }});


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
  var date=dateToDbKey();

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