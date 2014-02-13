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

Template.add.habits = function () {
  return Habits.find({});
};

Handlebars.registerHelper('habitButton', function(habit) {
  return '<a href="#" class="list-group-item edit-selector">'+habit.name+'</a>';
  var active = "";
  if (context.date == Session.get('lastUpdate')) { active =" active"; };
  return '<a href="#" class="list-group-item '+active+'" data-id="'+context.date+'">'+context.text+'</a>'
});
