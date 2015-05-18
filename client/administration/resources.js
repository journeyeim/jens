Controller('resources', {
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

      var name = e.target.value;

      if(e.keyCode == 13 && name && Courses.find( { course: name } ).count() === 0) {

        Meteor.call("courseAdding", name);

        e.target.value = "";
      }
    },
    "click .js-remove-course": function (e) {
      e.preventDefault();

      if(Session.get("courseSelected") === this._id) {
        Session.set("courseSelected", null);
      }

      Meteor.call("courseRemoving", this._id);
    },

    /* rooms */

    "keyup .js-add-room": function (e) {
      e.preventDefault();

      var name = e.target.value;

      if(e.keyCode == 13 && name && Rooms.find( { room: name } ).count() === 0) {

        Meteor.call("roomAdding", name);

        e.target.value = "";
      }
    },
    "click .js-remove-room": function (e) {
      e.preventDefault();

      Meteor.call("roomRemoving", this._id);
    },

    /* teachers */

    "keyup .js-add-teacher": function (e) {
      e.preventDefault();

      var name = e.target.value;

      if(e.keyCode == 13 && name && Teachers.find( { teacher: name } ).count() === 0) {

        Meteor.call("teacherAdding", name);

        e.target.value = "";
      }
    },
    "click .js-remove-teacher": function (e) {
      e.preventDefault();

      Meteor.call("teacherRemoving", this._id);
    },

    /* students */

    "keyup .js-add-student": function (e) {
      e.preventDefault();

      var student = e.target.value;

      if(e.keyCode == 13 && student) {

        var pair = student.split(",");

        if(pair.length === 2) {

          var name = pair[0].trim();
          var number = pair[1].trim();

          if(name.length > 0 && number.length > 0 && Students.find( { student: name, number: +number } ).count() === 0) {

            Meteor.call("studentAdding", name, +number);

            e.target.value = "";
          }
        }
      }
    },
    "keyup .js-add-students": function (e) {
      e.preventDefault();

      var students = e.target.value;

      if(e.keyCode == 13 && students) {

        var lines = students.split("\n");

        for(var i = 0; i < lines.length; i++) {

          var pair = lines[i].split(",");

          if(pair.length === 2) {

            var name = pair[0].trim();
            var number = pair[1].trim();

            if(name.length > 0 && number.length > 0 && Students.find( { student: name, number: number } ).count() === 0) {

              Meteor.call("studentAdding", name, number);
            }
          }
        }

        e.target.value = "";
      }
    },
    "click .js-remove-student": function (e) {
      e.preventDefault();

      Meteor.call("studentRemoving", this._id, this.number);
    }
  }
});
