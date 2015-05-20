Controller('schedules', {
  helpers: {

    /* schedule */

    schedules: function () {
      return Schedules.find( {}, { sort: { schedule: 1 } } );
    },
    scheduleSelected: function () {

      var option = Options.findOne( { key: "schedule" } );

      return option && option.value;
    },
    scheduleSelectedName: function () {

      var option = Options.findOne( { key: "schedule" } )

      return ( option && option.value ) ? option.value : "Select Schedule";
    }
  },
  events: {

    /* schedule */

    "click .js-select-schedule": function (e) {
      e.preventDefault();

      Meteor.call("optionSet", "schedule", this.schedule );
    },
    "keyup .js-add-schedule": function (e) {
      e.preventDefault();

      var name = e.target.value.trim();
      var copy = false;

      if ( ( name.charAt( 0 ) === '>' ) ) {

        copy = true;
        name = name.substr( 1 ).trim();
      }

      if( e.keyCode == 13
        && name
        && ( Schedules.find( { schedule: name } ).count() === 0 ) ) {

        Meteor.call("scheduleAdding", name, copy);

        e.target.value = "";
      }
    },
    "click .js-remove-schedule": function (e) {
      e.preventDefault();

      Meteor.call("scheduleRemoving", this.schedule);
    }
  }
});
