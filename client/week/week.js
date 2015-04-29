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
