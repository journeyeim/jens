Meteor.startup(function () {
  if (Lessons.find().count() === 0) {
    for(var i = 1; i<16; i++) {
      Lessons.insert({lesson: i, monday: [], tuesday: [], wednesday: [], thursday: [], friday: []});
    }
  }
});
