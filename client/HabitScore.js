Habits = new Meteor.Collection("habits");

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

Handlebars.registerHelper('habit', function(context) {
  out = '<input type="checkbox" class="test" name="' 
    + context._id  + '" ';
  
  if(context.done) { out += "checked" };

  out += '>' + context.name +'</input>';
  if (context.done) {
    out += "☺";
  }
  return out;
});

Handlebars.registerHelper("today", function()       {
	var t = new Date();
	var x = (t.getMonth() + 1) + "/" + (t.getDate() + 1) + "/" + t.getFullYear();
	return x;
});  


Template.debug.habits = function () {
  return Habits.find({});
};

Template.today.habits = function () {
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


Template.today.events({'submit': function() {
    $.each($('#date_form').serializeArray(), function() { 
      alert(this.name + ":"+ this.value);
    });
}});

Template.today.events({'change .test': function(event, template) {
  event.preventDefault();
  var box = template.find("input[name="+this._id+"]");
  Habits.update({_id: this._id}, {$set: {done: box.checked}});
}});

Template.debug.events({
    'click .dropAll': function(e, t){
      Meteor.call('removeAll');
    }
 })

Template.add.events(okCancelEvents('#add-habit',
  {
    ok: function (text, evt) {
      var id = Habits.insert({name: text, user:"ed", done: false});      
      evt.target.value = "";
    }
  }));
