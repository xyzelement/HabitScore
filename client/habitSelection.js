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

Template.habitSelectionTemplate.events(okCancelEvents('#add-habit', {
    ok: function (text, evt) {
      var id = Habits.insert({name: text, dates: []});      
      evt.target.value = "";
    }
}));

Template.habitSelectionTemplate.events({'click .edit-selector': function(event,template) {
        Session.set("currentlyEdited", this);
}});

Template.habitSelectionTemplate.events({'click .edit-save': function(event,template) {
  //EMTODO: input validation      
  var new_name = $('#edit-name').val();
  var id       = Session.get("currentlyEdited")._id;
  Habits.update({_id: id}, {$set: {name: new_name}});
}});

Template.habitSelectionTemplate.habits = function () {
  return Habits.find({});
};

Handlebars.registerHelper('habitButton', function(habit) {
  var active = "";
  var sel = Session.get('currentlyEdited');
  if (sel && habit._id == sel._id) { active =" active"; };
  return '<a href="#" class="list-group-item edit-selector '+active+'">'+habit.name+'</a>';
});
