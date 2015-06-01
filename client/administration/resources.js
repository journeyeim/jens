Controller('resources', {
  rendered: function() {
    Session.set("coursesNotice", "");
    Session.set("roomsNotice", "");
    Session.set("teachersNotice", "");
    Session.set("studentsNoticeA", "");
    Session.set("studentsNoticeB", "");
  },
  helpers: {
    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },
    coursesNotice: function () {
      return Session.get("coursesNotice");
    },
    rooms: function () {
      return Rooms.find( {}, { sort: { room: 1 } } );
    },
    roomsNotice: function () {
      return Session.get("roomsNotice");
    },
    teachers: function () {
      return Teachers.find( {}, { sort: { teacher: 1 } } );
    },
    teachersNotice: function () {
      return Session.get("teachersNotice");
    },
    students: function () {
      return Students.find( {}, { sort: { student: 1 } } );
    },
    studentsNoticeA: function () {
      return Session.get("studentsNoticeA");
    },
    studentsNoticeB: function () {
      return Session.get("studentsNoticeB");
    }
  },
  events: {

    /* courses */

    "keyup .js-add-course": function ( e ) {
      e.preventDefault();

      var course = new Course( e.target.value, e.keyCode );

      if ( ! course.error && e.keyCode === 13  ) {

        course.save();

        e.target.value = "";

        Session.set( "coursesNotice", "" );
      }
      else {
        Session.set( "coursesNotice", course.error );
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

      var name = e.target.value.trim();

      if(e.keyCode == 13
        && name
        && name.indexOf(",") === -1
        && Rooms.find( { room: name } ).count() === 0) {

        Meteor.call("roomAdding", name);

        e.target.value = "";

        Session.set("roomsNotice", "");
      }
      else {

        Session.set("roomsNotice", roomsNotice(
          e.keyCode,
          name,
          Rooms.find( { room: name } ).count()
        ));
      }
    },
    "click .js-remove-room": function (e) {
      e.preventDefault();

      Meteor.call("roomRemoving", this._id);
    },

    /* teachers */

    "keyup .js-add-teacher": function (e) {
      e.preventDefault();

      var name = e.target.value.trim();

      if(e.keyCode == 13
        && name
        && name.indexOf(",") === -1
        && Teachers.find( { teacher: name } ).count() === 0) {

        Meteor.call("teacherAdding", name);

        e.target.value = "";
      }
      else {

        Session.set("teachersNotice", teachersNotice(
          e.keyCode,
          name,
          Teachers.find( { teacher: name } ).count()
        ));
      }
    },
    "click .js-remove-teacher": function (e) {
      e.preventDefault();

      Meteor.call("teacherRemoving", this._id);
    },

    /* students */

    "keyup .js-add-student": function (e) {
      e.preventDefault();

      var student = e.target.value.trim();

      if(e.keyCode == 13 && student) {

        var pair = student.split(",");

        if(pair.length === 2) {

          var name = pair[0].trim();
          var number = pair[1].trim();

          if(name.length > 0
            && number.length > 0
            && number.isNumber()
            && Students.find( { student: name, number: +number } ).count() === 0) {

            Meteor.call("studentAdding", name, +number);

            e.target.value = "";
          }
          else {

            Session.set("studentsNoticeA", studentsNotice3(
              name,
              number,
              Students.find( { student: name, number: +number } ).count()
            ));
          }
        }
        else {
          Session.set("studentsNoticeA", "Right Format: 'Name, Number'");
        }
      }
      else {

        Session.set("studentsNoticeA", studentsNotice1(
          e.keyCode,
          student
        ));
      }
    },
    "keyup .js-add-students": function (e) {
      e.preventDefault();

      var students = e.target.value = e.target.value.trim();
      var misformats = [];

      if(e.keyCode == 13 && students) {

        var lines = students.split("\n");

        for(var i = 0; i < lines.length; i++) {

          var pair = lines[i].split(",");

          if(pair.length === 2) {

            var name = pair[0].trim();
            var number = pair[1].trim();

            if(name.length > 0
              && number.length > 0
              && number.isNumber()) {

              if(Students.find( { student: name, number: +number } ).count() === 0) {

                Meteor.call("studentAdding", name, +number);
              }
            }
            else {
              misformats.push(i+1);
            }
          }
          else {
            misformats.push(i+1);
          }
        }

        if(misformats.length === 0) {
          e.target.value = "";
        }
        else {
          Session.set("studentsNoticeB", "Wrong format on line " + misformats.join(", ") + ".");
        }
      }
      else {

        Session.set("studentsNoticeB", studentsNotice1(
          e.keyCode,
          students
        ));
      }
    },
    "click .js-remove-student": function (e) {
      e.preventDefault();

      Meteor.call("studentRemoving", this._id, this.number);
    }
  }
});

String.prototype.isNumber = function(){return /^\d+$/.test(this);}

var roomsNotice = function (keyCode, name, count) {
  if(keyCode == 13 && ! name ) {
    return "Enter Name";
  }
  else if (name.indexOf(",") !== -1) {
    return "Remove Comma";
  }
  else if (count !== 0) {
    return "Double Entry";
  }
  else {
    return "";
  }
}

var teachersNotice = function (keyCode, name, count) {
  if(keyCode == 13 && ! name ) {
    return "Enter Name";
  }
  else if (name.indexOf(",") !== -1) {
    return "Remove Comma";
  }
  else if (count !== 0) {
    return "Double Entry";
  }
  else {
    return "";
  }
}

var studentsNotice1 = function (keyCode, name) {
  if(keyCode == 13 && ! name ) {
    return "Enter Name";
  }
  else {
    return "";
  }
}

var studentsNotice3 = function (name, number, count) {
  if(name.length === 0) {
    return "Missing Name";
  }
  else if(number.length === 0) {
    return "Missing Number";
  }
  else if(! number.isNumber()) {
    return "Wrong Number";
  }
  else if(count !== 0) {
    return "Double Entry";
  }
  else {
    return "";
  }
}

Course = function ( name, keyCode ) {
  this._name = name && name.trim();
  this._keyCode = keyCode;
  this._error = "";

  if ( keyCode === 13 && ! this._name ) {
    this._error = "Enter Name";
  }
  else if ( Courses.find( { course: this._name } ).count() !== 0 ) {
    this._error = "Double Entry";
  }
};

Course.prototype = {
  save: function () {
    if ( ! this._name ) {
      throw "Name is not defined!";
    }
    else if ( this._keyCode !== 13 ) {
      throw "KeyCode is not 'enter'!";
    }
    else if ( this.error ) {
      throw "Implementation logic error!";
    }
    else {
      Meteor.call( "courseAdding", this._name );
    }
  },
  get name() {
    return this._name;
  },
  get error() {
    return this._error;
  }
};
