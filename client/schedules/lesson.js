Controller('lesson', {
  rendered: function() {
    Session.set("jsChooseCourse", "Course");
    Session.set("jsChooseRoom", "Room");
    Session.set("jsChooseTeacher", "Teacher");
  },
  helpers: {

    /* course */

    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    jsChooseCourse: function () {
      return Session.get("jsChooseCourse");
    },

    /* room */

    rooms: function () {
      return Rooms.find( {}, { sort: { room: 1 } } );
    },
    jsChooseRoom: function () {
      return Session.get("jsChooseRoom");
    },

    /* techer */

    teachers: function () {
      return Teachers.find( {}, { sort: { teacher: 1 } } );
    },
    jsChooseTeacher: function () {
      return Session.get("jsChooseTeacher");
    }
  },
  events: {

    /* choose resources */

    "click .js-choose-course": function (e) {
      e.preventDefault();

      Session.set("jsChooseCourse", e.target.text);
    },
    "click .js-choose-room": function (e) {
      e.preventDefault();

      Session.set("jsChooseRoom", e.target.text);
    },
    "click .js-choose-teacher": function (e) {
      e.preventDefault();

      Session.set("jsChooseTeacher", e.target.text);
    },

    /* add lesson */

    "click .js-add-lesson-btn": function (e) {
      e.preventDefault();

      var c = Session.get("jsChooseCourse");
      var r = Session.get("jsChooseRoom");
      var t = Session.get("jsChooseTeacher");

      var query = {};

      query[this.day] = {
        "course": c,
        "room": r,
        "teacher": t
      };

      if(c !== "Course" && r !== "Room" && t !== "Teacher") {
        Lessons.update( { "_id": this.parent.parent._id }, { "$push": query } );
      }
    }
  }
});
