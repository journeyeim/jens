Meteor.publish("courses", function () {
  if(this.userId) {
    return Courses.find();
  }
});

Meteor.publish("rooms", function () {
  if(this.userId) {
    return Rooms.find();
  }
});

Meteor.publish("teachers", function () {
  if(this.userId) {
    return Teachers.find();
  }
});

Meteor.publish("students", function () {
  if(this.userId) {
    return Students.find();
  }
});

Meteor.publish("classes", function () {
  if(this.userId) {
    return Classes.find();
  }
});

Meteor.publish("schedules", function () {
  if(this.userId) {
    return Schedules.find();
  }
});

Meteor.publish("columns", function () {
  if(this.userId) {
    return Columns.find();
  }
});

Meteor.publish("options", function () {
  if(this.userId) {
    return Options.find();
  }
});
