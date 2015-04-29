Controller('pairs', {
  helpers: {
    generateOpen: function () {
      return Session.get("generateOpen");
    },
    selectedCourse: function () {
      return Session.get("selectedCourse");
    },
    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    students: function () {
      var oneCourse = Courses.findOne( { _id: Session.get("selectedCourse") } );

      return (oneCourse ? (oneCourse.students.sort()) : []);
    }
  },
  events: {
    "click .js-generate": function (e) {
      e.preventDefault();

      Session.set("generateOpen", true);
    },
    "click .js-generate-close": function (e) {
      e.preventDefault();

      Session.set("generateOpen", false);
      Session.set("selectedCourse", null);
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
  }
});
