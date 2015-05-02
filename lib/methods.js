Meteor.methods({
  classSaving: function (className, students) {
    Classes.upsert({ class: className }, { $set: { students: students } });
  },
  classRemoving: function (id) {
    Classes.remove(id);
  },
  courseStudentAssignment: function (id, query) {
    Courses.update( { _id: id }, query );
  },
  courseAdding: function (name) {
    Courses.insert({ course: name, students: [] });
  },
  courseRemoving: function (id) {
    Courses.remove(id);
  },
  roomAdding: function (name) {
    Rooms.insert({ room: name });
  },
  roomRemoving: function (id) {
    Rooms.remove(id);
  },
  teacherAdding: function (name) {
    Teachers.insert({ teacher: name });
  },
  teacherRemoving: function (id) {
    Teachers.remove(id);
  },
  studentAdding: function (name, number) {
    Students.insert({ student: name, number: number });
  },
  studentRemoving: function (id, number) {
    Students.remove(id);

    var courses = Courses.find().fetch();

    for(var i = 0; i < courses.length; i++) {
      Courses.update( { _id: courses[i]._id }, { "$pull": { students: number } });
    }

    var classes = Classes.find().fetch();

    for(var i = 0; i < classes.length; i++) {
      Classes.update( { _id: classes[i]._id }, { "$pull": { students: number } });
    }
  }
});
