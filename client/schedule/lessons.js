Controller('lessons', {
  created: function() {
    this.notification = new ReactiveVar(null);
  },
  rendered: function() {
    //console.log(this);
    //isConflict(this, "rendered");
  },
  helpers: {
    le: function () {
      return Session.get("lesson");
    },
    da: function () {
      return Session.get("day");
    },
    equals: function (a, b, c, d) {
      return a === b && c === d;
    },
    notification: function () {
      return Template.instance().notification.get();
    },
    notificationClass: function () {
      var notes = Template.instance().notification.get();
      var boo = notes && (notes.length !== 0);

      return boo ? "js-conflict" : "js-no-conflict";
    }
  },
  events: {
    "click": function (e, t) {
      Meteor.defer(function() {
        //isConflict(t, "clicked");
      });
    },
    "click .js-remove-lesson": function (e) {
      e.preventDefault();

      var query = {};

      query[e.target.dataset.day] = {
        "course": this.course,
        "room": this.room,
        "teacher": this.teacher
      };

      Lessons.update( { "_id": e.target.dataset.id }, { "$pull": query } );
    }
  }
});

var isConflict = function (t, inf) {

  console.log(t.data.parent._id, t.data);

  var id = Session.get("scheduleSelected");
  var query = {};

  query[t.data.dayconst] = 1;

  var dayArr = Schedules.findOne({ _id: id });
  console.log("dayArr", dayArr);
  var lesArr = dayArr[0][t.data.dayconst];

  var co = [];
  var ro = [];
  var te = [];

  var note = [];

  for(var i = 0; i < lesArr.length; i++){

    if($.inArray(lesArr[i].course, co) === -1){
      co.push(lesArr[i].course);
    } else {
      note.push("Conflict on " + lesArr[i].course);
    }

    if($.inArray(lesArr[i].room, ro) === -1){
      ro.push(lesArr[i].room);
    } else {
      note.push("Conflict on " + lesArr[i].room);
    }

    if($.inArray(lesArr[i].teacher, te) === -1){
      te.push(lesArr[i].teacher);
    } else {
      note.push("Conflict on " + lesArr[i].teacher);
    }
  }


  t.notification.set(note.join("<br>"));
};
