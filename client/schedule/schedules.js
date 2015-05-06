Controller('schedules', {
  created: function() {
    Session.set("scheduleSelected", null);
  },
  helpers: {

    /* schedule */

    schedules: function () {
      return Schedules.find( {}, { sort: { schedule: 1 } } );
    },
    scheduleSelected: function () {
      return Session.get("scheduleSelected");
    },
    scheduleSelectedName: function () {

      var id = Session.get("scheduleSelected");

      return id ? Schedules.findOne( { _id: id }).schedule : "Select Schedule";
    }
  },
  events: {

    /* schedule */

    "click .js-select-schedule": function (e) {
      e.preventDefault();

      Session.set("scheduleSelected", this._id);
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
