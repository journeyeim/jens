Meteor.methods({

  /* course */

  courseStudentAssignment: function (id, query) {
    Courses.update( { _id: id }, query );
  },
  courseAdding: function (name) {
    Courses.insert( { course: name, students: [] } );
  },
  courseRemoving: function (id) {
    Courses.remove(id);
  },

  /* room */

  roomAdding: function (name) {
    Rooms.insert( { room: name } );
  },
  roomRemoving: function (id) {
    Rooms.remove(id);
  },

  /* teacher */

  teacherAdding: function (name) {
    Teachers.insert( { teacher: name } );
  },
  teacherRemoving: function (id) {
    Teachers.remove(id);
  },

  /* student */

  studentAdding: function (name, number) {
    Students.insert( { student: name, number: number } );
  },
  studentRemoving: function (id, number) {
    Students.remove(id);

    var courses = Courses.find().fetch();

    for(var i = 0; i < courses.length; i++) {
      Courses.update( { _id: courses[i]._id }, { "$pull": { students: number } } );
    }

    var classes = Classes.find().fetch();

    for(var i = 0; i < classes.length; i++) {
      Classes.update( { _id: classes[i]._id }, { "$pull": { students: number } } );
    }
  },

  /* class */

  classSaving: function (className, students) {
    Classes.upsert( { class: className }, { $set: { students: students } } );
  },
  classRemoving: function (id) {
    Classes.remove(id);
  },


  /* schedule */

  scheduleAdding: function (name) {

    Schedules.insert( { schedule: name } );

    for(var i = 1; i<16; i++) {
      Rows.insert( { schedule: name, lesson: i, monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] } );
    }
  },
  scheduleRemoving: function (id) {

    var schedule = Schedules.findOne( { _id: id} ).schedule;

    Schedules.remove( id );
    console.log("remove result", schedule, Rows.remove( { schedule: schedule } ));
  }
});
