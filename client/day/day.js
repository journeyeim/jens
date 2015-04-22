Template.day.helpers({
  rooms: function () {
    return Rooms.find( {}, { sort: { room: 1 } } );
  },
  jsChooseRoom: function () {
    return Session.get("js-choose-room");
  },
  courses: function () {
    return Courses.find( {}, { sort: { course: 1 } } );
  },
  jsChooseCourse: function () {
    return Session.get("js-choose-course");
  },
  teachers: function () {
    return Teachers.find( {}, { sort: { teacher: 1 } } );
  },
  jsChooseTeacher: function () {
    return Session.get("js-choose-teacher");
  },
  periods: function () {
    return Periods.find( {}, { sort: { period: 1 } } );
  },
  jsChoosePeriod: function () {
    return Session.get("js-choose-period");
  },
  actions: function () {
    var w = Weeks.findOne( { _id: this.sel } );
    return w?w.actions:null;
  }
});

Template.day.events({
  "click .js-choose-room": function (e) {
    e.preventDefault();

    Session.set("js-choose-room", e.target.text);
  },
  "click .js-choose-course": function (e) {
    e.preventDefault();

    Session.set("js-choose-course", e.target.text);
  },
  "click .js-choose-teacher": function (e) {
    e.preventDefault();

    Session.set("js-choose-teacher", e.target.text);
  },
  "click .js-choose-period": function (e) {
    e.preventDefault();

    Session.set("js-choose-period", e.target.text);
  },
  "click .js-add-action": function (e) {
    e.preventDefault();

    var r = Session.get("js-choose-room");
    var c = Session.get("js-choose-course");
    var t = Session.get("js-choose-teacher");
    var p = Session.get("js-choose-period");

    if(r !== "Room" && c !== "Course" && t !== "Teacher" && p !== "Period") {
      Weeks.update( { "_id": this.sel },
      { "$push": { "actions": { "room": r,
                                "course": c,
                                "teacher": t,
                                "period": p } } }
      );
    }
  },
  "click .js-remove-action": function (e) {
    e.preventDefault();

    var id = Session.get("js-choose-week");

    Weeks.update( { "_id": id },
      { "$pull": { "actions": { "room": this.room,
                                "course": this.course,
                                "teacher": this.teacher,
                                "period": this.period } } }
    );
  }
});

Template.day.rendered = function () {
    Session.set("js-choose-room", "Room");
    Session.set("js-choose-course", "Course");
    Session.set("js-choose-teacher", "Teacher");
    Session.set("js-choose-period", "Period");
    Session.set("js-choose-week", this.data.sel);
}
