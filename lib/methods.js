Meteor.methods({
  saveClass: function (className, students) {
    Classes.upsert({ class: className }, { $set: { students: students } });
  }
});
