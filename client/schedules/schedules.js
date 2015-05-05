Controller('schedules', {
  rendered: function() {
    Session.set("weekSelected", null);
  },
  helpers: {

    /* schedule */

    schedules: function () {
      return Schedules.find( {}, { sort: { schedule: 1 } } );
    },
    scheduleSelected: function () {
      return Session.get("scheduleSelected");
    }
  },
  events: {

    /* schedule */

    "click .js-schedules": function (e) {

      var value = e.target.value;

      Meteor.defer(function() {
        Session.set("scheduleSelected", value);
      });
    },
    "keyup .js-add-schedule": function (e) {
      e.preventDefault();

      var name = e.target.value;

      if(e.keyCode == 13 && name && Schedules.find( { schedule: name } ).count() === 0) {

        Meteor.call("scheduleAdding", name);

        e.target.value = "";
      }
    },
    "click .js-remove-schedule": function (e) {
      e.preventDefault();

      Meteor.call("scheduleRemoving", this._id);

      if(Session.get("scheduleSelected") === this._id) {
        Session.set("scheduleSelected", null);
      }
    }
  }
});
