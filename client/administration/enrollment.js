Controller('enrollment', {
  rendered: function() {
    Session.set("courseSelected", null);
    Session.set("sortByNumber", null);
  },
  helpers: {

    /* course */

    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
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

    /* class */

    classes: function () {
      return Classes.find( {}, { sort: { class: 1 } } );
    },
    classStudentCount: function ( id ) {

      return Classes.findOne( { _id: id } ).students.length;
    }
  },
  events: {

    /* course */

    "click .js-select-course": function (e) {

      var value = e.target.value;

      Meteor.defer(function() {
        Session.set("courseSelected", value);
      });
    },

    /* student */

    "change .js-select-student": function (e) {

      Meteor.call("courseEnrolling", Session.get("courseSelected"), this.number, e.target.checked);
    },
    "change .js-sort-student": function (e) {

      Session.set("sortByNumber", e.target.checked);
    },

    /* class */

    "keyup .js-save-class": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {

        var checkboxes = $(".js-select-student");
        var students = [];

        for(var i = 0; i < checkboxes.length; i++) {
          if(checkboxes[i].checked) {
            students.push(checkboxes[i].value);
          }
        }

        Meteor.call("classSaving", e.target.value, students);

        e.target.value = "";
      }
    },
    "click .js-load-class": function (e) {
      e.preventDefault();

      var students = this.students;
      var checkboxes = $(".js-select-student");

      for(var i = 0; i < checkboxes.length; i++) {

        var checkedBeforeChange = checkboxes[i].checked;

        if($.inArray(checkboxes[i].value, students) !== -1) {

          checkboxes[i].checked = true;

          if(! checkedBeforeChange) {
            $(checkboxes[i]).trigger("change");
          }
        }
        else {

          checkboxes[i].checked = false;

          if(checkedBeforeChange) {
            $(checkboxes[i]).trigger("change");
          }
        }
      }
    },
    "click .js-remove-class": function (e) {
      e.preventDefault();

      Meteor.call("classRemoving", this._id);
    }
  }
});
