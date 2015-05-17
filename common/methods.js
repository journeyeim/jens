Meteor.methods({

  /* course */

  courseEnrolling: function (id, query) {
    if(Meteor.userId()) {
      Courses.update( { _id: id }, query );
    }
  },
  courseAdding: function (name) {
    if(Meteor.userId()) {
      Courses.insert( { course: name, students: [] } );
    }
  },
  courseRemoving: function (id) {
    if(Meteor.userId()) {
      Courses.remove(id);
    }
  },

  /* room */

  roomAdding: function (name) {
    if(Meteor.userId()) {
      Rooms.insert( { room: name } );
    }
  },
  roomRemoving: function (id) {
    if(Meteor.userId()) {
      Rooms.remove(id);
    }
  },

  /* teacher */

  teacherAdding: function (name) {
    if(Meteor.userId()) {
      Teachers.insert( { teacher: name } );
    }
  },
  teacherRemoving: function (id) {
    if(Meteor.userId()) {
      Teachers.remove(id);
    }
  },

  /* student */

  studentAdding: function (name, number) {
    if(Meteor.userId()) {
      Students.insert( { student: name, number: number } );
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

  scheduleAdding: function (name) {

    if(Meteor.userId()) {
      Schedules.insert( { schedule: name }, function (err, id) {
        if(! err) {
          Meteor.call("optionSet", "schedule", id);
        }
      });

      for(var i = 1; i<16; i++) {
        Rows.insert( { schedule: name, lessonnr: i, monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] } );
      }
    }
  },
  scheduleRemoving: function (id) {
    if(Meteor.userId()) {

      var schedule = Schedules.findOne( { _id: id} ).schedule;

      if(Options.findOne( { key: "schedule" } ).value === id) {
        Meteor.call("optionSet", "schedule", null);
      }
      Rows.remove( { schedule: schedule } );
      Schedules.remove( id );
    }
  },

  /* row */

  lessonAdding: function (schedule, lessonnr, query) {
    if(Meteor.userId()) {
      Rows.update( { schedule: schedule, lessonnr: +lessonnr }, { $push: query } );
    }
  },
  lessonRemoving: function (schedule, lessonnr, query) {
    if(Meteor.userId()) {
      Rows.update( { schedule: schedule, lessonnr: +lessonnr }, { $pull: query } );
    }
  },

  /* option */

  optionSet: function (key, value) {
    if(Meteor.userId()) {
      Options.upsert( { key: key }, { $set: { value: value } } );
    }
  }
});
