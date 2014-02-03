Habits = new Meteor.Collection("habits");

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

function dateToDbKey() {
  return moment($('#picker').datepicker('getDate')).format("YYYYMMDD");
}

Handlebars.registerHelper('habit', function(context) {
  var done = ($.inArray(Session.get("lastUpdate"), context.dates) > -1);
  out = '<div class="checkbox"><label><input type="checkbox" class="test" name="' + context._id  + '" ';
  if(done) { out += "checked" };
  out += '>' + context.name +'</input>';
  if (done) { out += "☺"; }
  out += "</label><div>";
  return out;
});
 

Template.debug.habits = function () {
  return Habits.find({});
};

Meteor.startup(function() {
  $('#picker').datepicker({
      format: "M d, yyyy, D",
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      todayHighlight: true,
  });
  $('#picker').datepicker('setDate', new Date());
  $('#picker').datepicker()
    .on("changeDate", function(e){
        Session.set('lastUpdate', dateToDbKey() );
    });  
  Session.set('lastUpdate', dateToDbKey() );
});

Template.today.events({'click #next_date': function() {
  var date1 = $('#picker').datepicker('getDate');
  var date = new Date( Date.parse( date1 ) ); 
  date.setDate( date.getDate() + 1 );
  $('#picker').datepicker('setDate', date );
  //Session.set('lastUpdate', dateToDbKey() );
}});

Template.today.events({'click #previous_date': function() {
  var date1 = $('#picker').datepicker('getDate');
  var date = new Date( Date.parse( date1 ) ); 
  date.setDate( date.getDate() - 1 );
  $('#picker').datepicker('setDate', date );
  //Session.set('lastUpdate', dateToDbKey() );
}});


function huh(){
  console.log ("-->" + Session.get("lastUpdate"));
}

Deps.autorun(huh);

Template.today.habits = function () {
  return Habits.find({});
};

Template.today.lastUpdate = function () {
      return Session.get('lastUpdate');
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

  //var date = template.find("input[name=the_date]").value;
  var date=dateToDbKey();

  if (box.checked) {
    //EMTODO: Would be nice to treat this as a "set" to avoid 
    //adding the same date twice.
    Habits.update({_id: this._id}, {$push: {dates: date}});
  } else {
    Habits.update({_id: this._id}, {$pull: {dates: date}});
  }
}});

Template.debug.events({
    'click .dropAll': function(e, t){
      Meteor.call('removeAll');
    }
 })

Template.add.events(okCancelEvents('#add-habit',
  {
    ok: function (text, evt) {
      var id = Habits.insert({name: text, user:"ed", done: false, dates: []});      
      evt.target.value = "";
    }
  }));


