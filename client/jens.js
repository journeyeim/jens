
if (Meteor.isClient) {

  var checkingConflict = function() {
      Session.set("scheduleConflict", (Schedule.find( {} ).count() > 1) ? "There might be conflicts!" : null );
  }

  Template.schedule.rendered = function() { checkingConflict() };

  Template.schedule.helpers({
    scheduleOpen: function () {
      return Session.get("scheduleOpen");
    },
    scheduleError: function () {
      return Session.get("scheduleError");
    },
    scheduleConflict: function () {
      return Session.get("scheduleConflict");
    },
    rooms: function () {
      return Rooms.find( {}, { sort: { room: 1 } } );
    },
    teachers: function () {
      return Teachers.find( {}, { sort: { teacher: 1 } } );
    },
    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    schedule: function () {
      return Schedule.find( {} );
    }
  });

  Template.create.helpers({
    createOpen: function () {
      return Session.get("createOpen");
    },
    rooms: function () {
      return Rooms.find( {}, { sort: { room: 1 } } );
    },
    teachers: function () {
      return Teachers.find( {}, { sort: { teacher: 1 } } );
    },
    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    }
  });

  Template.generate.helpers({
    generateOpen: function () {
      return Session.get("generateOpen");
    },
    selectedCourse: function () {
      return Session.get("selectedCourse");
    },
    studentExist: function () {
      var oneCourse = Courses.findOne( { _id: Session.get("selectedCourse") } );

      return (oneCourse ? (oneCourse.students.length > 0) : false);
    },
    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    students: function () {
      var oneCourse = Courses.findOne( { _id: Session.get("selectedCourse") } );

      return (oneCourse ? (oneCourse.students.sort()) : []);
    }
  });

  Template.schedule.events({
    "click .js-schedule": function (e) {
      e.preventDefault();

      Session.set("scheduleOpen", true);
    },
    "click .js-schedule-close": function (e) {
      e.preventDefault();

      Session.set("scheduleOpen", false);
    },
    "click .js-add-schedule": function (e) {
      e.preventDefault();

      var c = $(".js-courses label.active input").attr("id");
      var t = $(".js-teachers label.active input").attr("id");
      var r = $(".js-rooms label.active input").attr("id");

      if(c && t && r) {

        Schedule.insert({ course: c, teacher: t, room: r });

        Session.set("scheduleError", null);

        checkingConflict();

      } else {

        var scheduleError = !c ? "Select Course!" : !t ? "Select Teacher!" : !r ? "Select Room!" : null;

        Session.set("scheduleError", scheduleError);
      }

      e.target.blur();
    },
    "click .js-remove-schedule": function (e) {
      e.preventDefault();

      Schedule.remove(this._id);

      checkingConflict();
    }
  });

  Template.create.events({
    "click .js-create": function (e) {
      e.preventDefault();

      Session.set("createOpen", true);
    },
    "click .js-create-close": function (e) {
      e.preventDefault();

      Session.set("createOpen", false);
    },
    "keyup .js-add-room": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {
        Rooms.insert({ room: e.target.value });
        e.target.value = "";
      }
    },
    "click .js-remove-room": function (e) {
      e.preventDefault();

      Rooms.remove(this._id);
    },
    "keyup .js-add-teacher": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {
        Teachers.insert({ teacher: e.target.value });
        e.target.value = "";
      }
    },
    "click .js-remove-teacher": function (e) {
      e.preventDefault();

      Teachers.remove(this._id);
    },
    "keyup .js-add-course": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {
        Courses.insert({ course: e.target.value, students: [] });
        /* update - upsert by method */
        e.target.value = "";
      }
    },
    "click .js-remove-course": function (e) {
      e.preventDefault();

      if(Session.get("selectedCourse") === this._id) {
        Session.set("selectedCourse", null);
      }

      Courses.remove(this._id);
    }
  });

  Template.generate.events({
    "click .js-generate": function (e) {
      e.preventDefault();

      Session.set("generateOpen", true);
    },
    "click .js-generate-close": function (e) {
      e.preventDefault();

      Session.set("generateOpen", false);
    },
    "click .js-courses": function (e) {
      e.preventDefault();

      Meteor.defer(function() {

        var selectedCourseId = $(".js-courses label.active input").attr("id");

        Session.set("selectedCourse", selectedCourseId);
      });
    },
    "keyup .js-add-student": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {
        Courses.update( { _id: Session.get("selectedCourse") }, { $push: { students: e.target.value } } );

        e.target.value = "";
      }
    },
    "click .js-remove-student": function (e) {
      e.preventDefault();

      Courses.update( { _id: Session.get("selectedCourse") }, { $pull: { students: String(this) } } );
    }
  });
}
