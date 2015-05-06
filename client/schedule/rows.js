Controller('rows', {
  created: function() {
    this.schedule = new ReactiveVar(null);
    this.lesson = new ReactiveVar(null);
    this.day = new ReactiveVar(null);
  },
  helpers: {
    rows: function () {
      return Rows.find( { schedule: Schedules.findOne( { _id: Session.get("scheduleSelected") } ).schedule } );
    },
    headers: function () {
      return headers;
    },
    modalSchedule: function () {
      return Template.instance().schedule.get();
    },
    modalLesson: function () {
      return Template.instance().lesson.get();
    },
    modalDay: function () {
      return Template.instance().day.get();
    }
  },
  events: {/*
    "click": function (e) {
      e.preventDefault();

      Session.set("lesson", null);
      Session.set("day", null);
    },*/
    "dblclick td": function (e, t) {
      e.preventDefault();

      t.schedule.set(this.schedule);
      t.lesson.set(this.lesson);
      t.day.set(headers[e.currentTarget.cellIndex].toLowerCase());

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
