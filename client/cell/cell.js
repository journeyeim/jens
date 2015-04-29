Controller('cell', {
  created: function() {
    // Stuff to do on created.
  },
  rendered: function() {
    // Stuff to do on rendered.
  },
  destroyed: function() {
    // Stuff to do on destroyed.
  },
  helpers: {
    le: function () {
      return Session.get("lesson");
    },
    da: function () {
      return Session.get("day");
    },
    equals: function (a, b, c, d) {
      return a === b && c === d;
    }
  },
  events: {
    "click .js-remove-lesson": function (e, t) {
      e.preventDefault();

      console.log(e, t.data, this);

      var query = {};

      query[e.target.dataset.day] = {
        "course": this.course,
        "room": this.room,
        "teacher": this.teacher
      };

      Lessons.update( { "_id": e.target.dataset.id }, { "$pull": query } );
    }
  }
});
