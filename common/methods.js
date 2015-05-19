Meteor.methods({

  /* course */

  courseEnrolling: function (id, number, checked) {
    if(Meteor.userId()) {

      var query = {};

      query[checked ? "$push" : "$pull"] = { students: number };

      Courses.update( { _id: id }, query );

      fullConflictCheck();
    }
  },
  courseAdding: function (course) {
    if(Meteor.userId()) {
      Courses.insert( { course: course, students: [] } );

      fullConflictCheck();
    }
  },
  courseRemoving: function (id) {
    if(Meteor.userId()) {
      Courses.remove(id);

      fullConflictCheck();
    }
  },

  /* room */

  roomAdding: function (room) {
    if(Meteor.userId()) {
      Rooms.insert( { room: room } );

      fullConflictCheck();
    }
  },
  roomRemoving: function (id) {
    if(Meteor.userId()) {
      Rooms.remove(id);

      fullConflictCheck();
    }
  },

  /* teacher */

  teacherAdding: function (teacher) {
    if(Meteor.userId()) {
      Teachers.insert( { teacher: teacher } );

      fullConflictCheck();
    }
  },
  teacherRemoving: function (id) {
    if(Meteor.userId()) {
      Teachers.remove(id);

      fullConflictCheck();
    }
  },

  /* student */

  studentAdding: function (student, number) {
    if(Meteor.userId()) {
      Students.insert( { student: student, number: number } );
    }
  },
  studentRemoving: function (id, number) {
    if(Meteor.userId()) {
      Students.remove(id);

      var courses = Courses.find().fetch();

      for(var i = 0; i < courses.length; i++) {
        Courses.update( { _id: courses[i]._id }, { "$pull": { students: number } } );
      }

      Options.update( { key: "enrollment" }, { "$pull": { value: number } } );

      fullConflictCheck();
    }
  },

  /* schedule */

  scheduleAdding: function (schedule) {
    if(Meteor.userId()) {

      Schedules.insert( { schedule: schedule }, function (err, id) {
        if(! err) {
          Meteor.call("optionSet", "schedule", id);
        }
      });

      var days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" ];

      for(var rowIdx = 1; rowIdx <= 15; rowIdx++) {

        Rows.insert( {
          schedule: schedule,
          lessonnr: rowIdx
        } );

        for(var columnIdx = 1; columnIdx <= 5; columnIdx++) {

          Columns.insert( {
            schedule: schedule,
            lessonnr: rowIdx,
            daynr: columnIdx,
            day: days[columnIdx - 1],
            lessons: [],
            conflict: ""
          } );
        }
      }
    }
  },
  scheduleRemoving: function (id) {
    if(Meteor.userId()) {

      if(Options.findOne( { key: "schedule" } ).value === id) {
        Meteor.call("optionSet", "schedule", null);
      }

      var schedule = Schedules.findOne( { _id: id } ).schedule;

      Columns.remove( { schedule: schedule } );
      Rows.remove( { schedule: schedule } );
      Schedules.remove( { schedule: schedule } );
    }
  },

  /* row - lesson */

  lessonAdding: function (schedule, lessonnr, day, lesson) {
    if(Meteor.userId()) {

      if(Columns.find( { schedule: schedule, lessonnr: +lessonnr, day: day, lessons: lesson } ).count() === 0) {
        Columns.update( { schedule: schedule, lessonnr: +lessonnr, day: day },
          { $push: { lessons: lesson } } );

        var lessons = Columns.findOne( { schedule: schedule, lessonnr: +lessonnr, day: day } ).lessons;

        var conflict = getConflict(lessons);

        Columns.update( { schedule: schedule, lessonnr: +lessonnr, day: day },
          { $set: { conflict: conflict } } );
      }
    }
  },
  lessonRemoving: function (schedule, lessonnr, day, lesson) {
    if(Meteor.userId()) {

      Columns.update( { schedule: schedule, lessonnr: +lessonnr, day: day },
        { $pull: { lessons: lesson } } );

      var lessons = Columns.findOne( { schedule: schedule, lessonnr: +lessonnr, day: day } ).lessons;

      var conflict = getConflict(lessons);

      Columns.update( { schedule: schedule, lessonnr: +lessonnr, day: day },
        { $set: { conflict: conflict } } );
    }
  },

  /* option */

  optionSet: function (key, value) {
    if(Meteor.userId()) {
      Options.upsert( { key: key }, { $set: { value: value } } );
    }
  }
});

Array.prototype.pushArray = function() {

  var toPush = this.concat.apply([], arguments);

  for (var i = 0, len = toPush.length; i < len; ++i) {
    this.push(toPush[i]);
  }
};

Array.prototype.pushStudents = function (course) {

  var students = Courses.findOne( { course: course } ).students;

  for (var i = 0, len = students.length; i < len; ++i) {
    this.push(  { student: students[i], course: course } );
  }
}

var fullConflictCheck = function () {
  console.log("fullConflictCheck");
  var columns = Columns.find().fetch();

  for(var i = 0; i < columns.length; i++) {

    var lessons = columns[i].lessons;
    var conflict = getConflict(lessons);

    Columns.update( { _id: columns[i]._id },
      { $set: { conflict: conflict } } );
  }
}

var getConflict = function (lessons) {

  var courses = [];
  var coursesRemoved = [];
  var rooms = [];
  var roomsRemoved = [];
  var teachers = [];
  var teachersRemoved = [];
  var students = [];
  var duplicates = [];

  for(var i = 0; i < lessons.length; i++) {

    var course = lessons[i].course;
    if(Courses.findOne( { course: course } )) {
      courses.push(course);
      students.pushStudents(course);
    }
    else {
      coursesRemoved.push(course);
    }

    for(var r = 0, room = lessons[i].room; r < room.length; r++) {
      if(Rooms.findOne( { room: room[r] } )) {
        rooms.push(room[r]);
      }
      else {
        roomsRemoved.push(room[r]);
      }
    }

    for(var t = 0, teacher = lessons[i].teacher; t < teacher.length; t++) {
      if(Teachers.findOne( { teacher: teacher[t] } )) {
        teachers.push(teacher[t]);
      }
      else {
        teachersRemoved.push(teacher[t]);
      }
    }
  }

  coursesRemoved = coursesRemoved.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });

  for(var i = 0; i < coursesRemoved.length; i++) {
    duplicates.push(coursesRemoved[i] + "(removed)");
  }

  roomsRemoved = roomsRemoved.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });

  for(var i = 0; i < roomsRemoved.length; i++) {
    duplicates.push(roomsRemoved[i] + "(removed)");
  }

  teachersRemoved = teachersRemoved.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });

  for(var i = 0; i < teachersRemoved.length; i++) {
    duplicates.push(teachersRemoved[i] + "(removed)");
  }

  duplicates.pushArray(getDuplicates(courses));
  duplicates.pushArray(getDuplicates(rooms));
  duplicates.pushArray(getDuplicates(teachers));
  duplicates.pushArray(getDuplicateStudents(students));

  return duplicates.join(', ');
}

var getDuplicates = function (array) {

  array.sort();

  var duplicates = [];
  var elementA = "";
  var elementB = "";

  for(var i = 0; i < array.length; i++) {
   if(elementB !== elementA && elementA === array[i]) {
     duplicates.push(array[i]);
   }
   elementB = elementA;
   elementA = array[i];
  }

  return duplicates;
}

var getDuplicateStudents = function (array) {

  array.sort(function (a,b) {
    if (a.student < b.student)
      return -1;
    if (a.student > b.student)
      return 1;
    return 0;
  });

  var previous = {};
  var courses = [];
  var duplicates = [];

  for(var i = 0; i < array.length; i++) {

    if(array[i].student === previous.student) {
      /* collection */
      if(courses.length === 0) {
        courses.push(previous.course);
      }
      courses.push(array[i].course);
    }
    else {
      /* storage */
      if(courses.length !== 0) {

        courses = courses.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });

        duplicates.push(previous.student + "@" + courses.join("&"));

        courses = [];
      }
    }

    previous = array[i];
  }

  /* storage */
  if(courses.length !== 0) {

    courses = courses.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });

    duplicates.push(previous.student + "@" + courses.join("&"));

    courses = [];
  }

  return duplicates;
}
