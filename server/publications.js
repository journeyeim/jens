Meteor.publish("courses", function () {
  return Courses.find();
});

Meteor.publish("rooms", function () {
  return Rooms.find();
});

Meteor.publish("teachers", function () {
  return Teachers.find();
});

Meteor.publish("students", function () {
  return Students.find();
});

Meteor.publish("classes", function () {
  return Classes.find();
});

Meteor.publish("schedules", function () {
  return Schedules.find();
});

Meteor.publish("rows", function () {
  return Rows.find();
});

Meteor.publish("options", function () {
  return Options.find();
});
