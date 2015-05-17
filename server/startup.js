Meteor.startup(function () {

  if(Meteor.users.find().count() === 0) {

    var uid =  Accounts.createUser({
      email: "journeyeim@gmail.com",
      password: "1password"
    });
  }

  var course = Courses.find().count() === 0;
  var room = Rooms.find().count() === 0;
  var teacher = Teachers.find().count() === 0;
  var student = Students.find().count() === 0;

  if(course && room && teacher && student) {
    Courses.insert( { course: "DIM", students: [930341, 614664] } );
    Courses.insert( { course: "MOB", students: [930341] } );
    Rooms.insert( { room: "VBI-8.11" } );
    Rooms.insert( { room: "VBI-8.12" } );
    Rooms.insert( { room: "VBI-8.13" } );
    Teachers.insert( { teacher: "DIMT" } );
    Teachers.insert( { teacher: "MOBT" } );
    Students.insert( { student: "Peter Clever", number: 614664 } );
    Students.insert( { student: "James Smart", number: 930341 } );
  }
});
