Controller('rows', {
  created: function() {
    this.schedule = new ReactiveVar(null);
    this.day = new ReactiveVar(null);
    this.lesson = new ReactiveVar(null);
  },
  helpers: {
    rows: function () {
      return Rows.find( { schedule: Schedules.findOne( { _id: Session.get("scheduleSelected") } ).schedule }, { sort: { lesson: 1 } } );
    },
    headers: function () {
      return headers;
    },
    modalSchedule: function () {
      return Template.instance().schedule.get();
    },
    modalDay: function () {
      return Template.instance().day.get();
    },
    modalLesson: function () {
      return Template.instance().lesson.get();
    }
  },
  events: {
    "click td": function (e, t) {
      e.preventDefault();

      t.schedule.set(this.schedule);
      t.day.set(headers[e.currentTarget.cellIndex].toLowerCase());
      t.lesson.set(this.lesson);

      $("#addLessonModal").modal('show');
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
