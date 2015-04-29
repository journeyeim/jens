Controller('weeks', {
  created: function() {
    // Stuff to do on created.
  },
  rendered: function() {
    Session.set("selected", null);
  },
  destroyed: function() {
    // Stuff to do on destroyed.
  },
  helpers: {
    weeks: function () {
      return Weeks.find( {}, { sort: { week: 1 } } );
    },
    selected: function () {
      return Session.get("selected");
    }
  },
  events: {
    "keyup .js-add-week": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {
        Weeks.insert({ week: e.target.value, actions: [] });
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
    }
  }
});
