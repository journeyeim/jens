Controller('week', {
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
    lessons: function () {
      return Lessons.find( {}, { sort: { lesson: 1 } } );
    },
    headers: function () {
      return headers;
    },
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
    "click": function (e) {
      e.preventDefault();

      Session.set("lesson", null);
      Session.set("day", null);
    },
    "click td": function (e) {
      e.preventDefault();

      var lesson = this.lesson;
      var day = headers[e.currentTarget.cellIndex].toLowerCase();

      Session.set("lesson", lesson);
      Session.set("day", day);
    },
    "click .js-remove-lesson": function (e, t) {
      e.preventDefault();

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

var headers = [
  "#",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
