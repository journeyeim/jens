Controller('cell', {
  created: function() {
    // Stuff to do on created.
    this.notification = new ReactiveVar(null);
  },
  rendered: function() {
    // Stuff to do on rendered.
    isConflict(this);
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
        isConflict(t);
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

var isConflict = function (t) {

  t.data.parent.lesson

  var query = {};

  query[t.data.dayconst] = 1;

  var dayA = Lessons.find({ _id: t.data.parent._id }, { fields: query }).fetch();
  var lesA = dayA[0][t.data.dayconst];

  var co = [];
  var ro = [];
  var te = [];

  var note = [];

  for(var i = 0; i < lesA.length; i++){

    if($.inArray(lesA[i].course, co) === -1){
      co.push(lesA[i].course);
    } else {
      note.push("Conflict on " + lesA[i].course);
    }

    if($.inArray(lesA[i].room, ro) === -1){
      ro.push(lesA[i].room);
    } else {
      note.push("Conflict on " + lesA[i].room);
    }

    if($.inArray(lesA[i].teacher, te) === -1){
      te.push(lesA[i].teacher);
    } else {
      note.push("Conflict on " + lesA[i].teacher);
    }
  }


  t.notification.set(note.join("<br>"));
};
