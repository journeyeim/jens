Controller('enrollment', {
  rendered: function() {
    Session.set("courseSelected", null);
    Session.set("sortByNumber", null);

    Meteor.setTimeout(function(){
      $(".js-select-course").first().trigger("click");
    }, 1 );
  },
  helpers: {

    /* course */

    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    courseExist: function () {
      return Courses.find().count() > 0;
    },
    courseSelected: function () {
      return Session.get("courseSelected");
    },
    courseStudentCount: function ( id ) {

      return Courses.findOne( { _id: id } ).students.length;
    },

    /* student */

    students: function () {
      var query = Session.get("sortByNumber") ? { number: 1 } : { student: 1 };

      return Students.find( {}, { sort: query } );
    },
    studentExist: function () {
      return Students.find( ).count() > 0;
    },
    studentChecked: function ( number ) {

      var course = Courses.findOne( { _id: Session.get("courseSelected") } );

      var checked = false;

      for(var i = 0; i < course.students.length; i++) {

        if(course.students[i] === number) {
          checked = true;
          break;
        }
      }

      return checked;
    },

    /* option */

    enrollmentCount: function () {

      var enrollment = Options.findOne( { key: "enrollment" } );
      return enrollment ? enrollment.value.length : 0;
    }
  },
  events: {

    /* course */

    "click .js-select-course": function (e) {

      var value = e.target.value;

      Session.set("courseSelected", value);
    },

    /* student */

    "change .js-select-student": function (e) {

      Meteor.call("courseEnrolling", Session.get("courseSelected"), this.number, e.target.checked);
    },

    /* option */

    "change .js-sort-student": function (e) {

      Session.set("sortByNumber", e.target.checked);
    },
    "click .js-copy-enrollment": function (e) {
      e.preventDefault();

        var checkboxes = $(".js-select-student");
        var students = [];

        for(var i = 0; i < checkboxes.length; i++) {
          if(checkboxes[i].checked) {
            students.push(+checkboxes[i].value);
          }
        }

        Meteor.call("optionSet", "enrollment", students );
    },
    "click .js-paste-enrollment": function (e) {
      e.preventDefault();

      var students = Options.findOne( { key: "enrollment" } ).value;
      var checkboxes = $(".js-select-student");

      for(var i = 0; i < checkboxes.length; i++) {

        if($.inArray(+checkboxes[i].value, students) !== -1) {

          if(checkboxes[i].checked === false) {
            checkboxes[i].checked = true;
            $(checkboxes[i]).trigger("change");
          }
        }
        else {

          if(checkboxes[i].checked === true) {
            checkboxes[i].checked = false;
            $(checkboxes[i]).trigger("change");
          }
        }
      }
    }
  }
});
