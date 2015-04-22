Template.weeks.helpers({
  weeks: function () {
    return Weeks.find( {}, { sort: { week: 1 } } );
  },
  rooms: function () {
    return Rooms.find( {}, { sort: { room: 1 } } );
  },
  courses: function () {
    return Courses.find( {}, { sort: { course: 1 } } );
  },
  teachers: function () {
    return Teachers.find( {}, { sort: { teacher: 1 } } );
  },
  debug: function () {
    return Session.get("selected");
  }
});

Template.weeks.events({
  "keyup .js-add-week": function (e) {
    e.preventDefault();

    if(e.keyCode == 13 && e.target.value) {
      Weeks.insert({ week: e.target.value });
      /* update - upsert by method */
      e.target.value = "";
    }
  },
  "click .js-remove-week": function (e) {
    e.preventDefault();

    Weeks.remove(this._id);

    if(Session.get("selected") === this._id) {
      Session.set("selected", null);
    }
  },
  "click .js-weeks": function (e) {
    e.preventDefault();

    Meteor.defer(function() {

      var selected = $(".js-weeks label.active input").attr("id");

      Session.set("selected", selected);
    });
  },
});

Template.weeks.rendered = function () {
  Session.set("selected", null);
}
