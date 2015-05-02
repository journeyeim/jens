Controller('lists', {
  helpers: {
    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    rooms: function () {
      return Rooms.find( {}, { sort: { room: 1 } } );
    },
    teachers: function () {
      return Teachers.find( {}, { sort: { teacher: 1 } } );
    },
    students: function () {
      return Students.find( {}, { sort: { student: 1 } } );
    }
  },
  events: {

    /* courses */

    "keyup .js-add-course": function (e) {
      e.preventDefault();
      // esc html!!!
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
    },

    /* rooms */

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

    /* teachers */

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

    /* students */

    "keyup .js-add-student": function (e) {
      e.preventDefault();

      if(e.keyCode == 13 && e.target.value) {

        //separate name and number from e.target.value
        var pair = e.target.value.split(",");

        if(pair.length === 2 && e.target.value) {

          var name = pair[0].trim();
          var number = pair[1].trim();

            if(name.length > 0 && number.length > 0) {

              Students.insert({ student: name, number: number });
              e.target.value = "";
            }
        }
      }
    },
    "keyup .js-add-students": function (e) {
      e.preventDefault();
      // over lists templ: implement textarea

    },
    "click .js-remove-student": function (e) {
      e.preventDefault();

      Students.remove(this._id);

      // remove from everywhere !!!
    }
  }
});
