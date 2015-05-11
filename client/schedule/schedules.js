Controller('schedules', {
  helpers: {

    /* schedule */

    schedules: function () {
      return Schedules.find( {}, { sort: { schedule: 1 } } );
    },
    scheduleSelected: function () {

      var option = Options.findOne( { key: "schedule" } )

      return option && option.value;
    },
    scheduleSelectedName: function () {

      var option = Options.findOne( { key: "schedule" } )
      var id = option && option.value;

      return id ? Schedules.findOne( { _id: id }).schedule : "Select Schedule";
    }
  },
  events: {

    /* schedule */

    "click .js-select-schedule": function (e) {
      e.preventDefault();

      Meteor.call("optionSet", "schedule", this._id );
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
    }
  }
});
