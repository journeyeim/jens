Meteor.methods({

  /* course */

  courseEnrolling: function (id, query) {
    if(Meteor.userId()) {
      Courses.update( { _id: id }, query );
    }
  },
  courseAdding: function (course) {
    if(Meteor.userId()) {
      Courses.insert( { course: course, students: [] } );
    }
  },
  courseRemoving: function (id) {
    if(Meteor.userId()) {
      Courses.remove(id);
    }
  },

  /* room */

  roomAdding: function (room) {
    if(Meteor.userId()) {
      Rooms.insert( { room: room } );
    }
  },
  roomRemoving: function (id) {
    if(Meteor.userId()) {
      Rooms.remove(id);
    }
  },

  /* teacher */

  teacherAdding: function (teacher) {
    if(Meteor.userId()) {
      Teachers.insert( { teacher: teacher } );
    }
  },
  teacherRemoving: function (id) {
    if(Meteor.userId()) {
      Teachers.remove(id);
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

      var classes = Classes.find().fetch();

      for(var i = 0; i < classes.length; i++) {
        Classes.update( { _id: classes[i]._id }, { "$pull": { students: number } } );
      }
    }
  },

  /* class */

  classSaving: function (className, students) {
    if(Meteor.userId()) {
      Classes.upsert( { class: className }, { $set: { students: students } } );
    }
  },
  classRemoving: function (id) {
    if(Meteor.userId()) {
      Classes.remove(id);
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

      Columns.update( { schedule: schedule, lessonnr: +lessonnr, day: day },
        { $push: { lessons: lesson } } );

      var lessons = Columns.findOne( { schedule: schedule, lessonnr: +lessonnr, day: day } ).lessons;

      var conflict = getConflict(lessons);

      Columns.update( { schedule: schedule, lessonnr: +lessonnr, day: day },
        { $set: { conflict: conflict } } );
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

var getConflict = function (lessons) {

  var courses = [];
  var rooms = [];
  var teachers = [];

  for(var i = 0; i < lessons.length; i++) {
    courses.push(lessons[i].course);
    rooms.pushArray(lessons[i].room);
    teachers.pushArray(lessons[i].teacher);
  }

  var duplicates = [];

  duplicates.pushArray(getDuplicates(courses));
  duplicates.pushArray(getDuplicates(rooms));
  duplicates.pushArray(getDuplicates(teachers));

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
