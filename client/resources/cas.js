Controller('cas', {
  rendered: function() {
    // Stuff to do on rendered.
    Session.set("courseSelected", null);
    Session.set("sortByNumber", null);
  },
  helpers: {

    /* courses */

    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    courseSelected: function () {
      return Session.get("courseSelected");
    },

    /* students */

    students: function () {
      var query = Session.get("sortByNumber") ? { number: 1 } : { student: 1 };

      return Students.find( {}, { sort: query } );
    },
    studentCount: function ( id ) {

      return Courses.findOne( { _id: id } ).students.length;
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

    /* classes */

    classes: function () {
      return Classes.find( {}, { sort: { class: 1 } } );
    }
  },
  events: {

// upsert in order to avoid duplicats
// esc html on inputs
// onRemoveStudent remove it from all arrays !!!

    /* course */

    "click .js-courses": function (e) {

      var value = e.target.value;

      Meteor.defer(function() {
        Session.set("courseSelected", value);
      });
    },

    /* student */

    "change .js-student-sort": function (e) {

      Session.set("sortByNumber", e.target.checked);
    },
    "change .js-students": function (e) {

      var query = {};

      query[e.target.checked ? "$push" : "$pull"] = { students: this.number };

      Courses.update( { _id: Session.get("courseSelected") }, query );
    },

    /* classes */

    "keyup .js-save-class": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {

        var checkboxes = $(".js-students");
        var students = [];

        for(var i = 0; i < checkboxes.length; i++) {
          if(checkboxes[i].checked) {
            students.push(checkboxes[i].value);
          }
        }

        Meteor.call("saveClass", e.target.value, students);

        e.target.value = "";
      }
    },
    "click .js-load-class": function (e) {
      e.preventDefault();

      var students = this.students;
      var checkboxes = $(".js-students");

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

      Classes.remove(this._id);
    }
  }
});
