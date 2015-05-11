Controller('add', {
  helpers: {

    /* course */

    courses: function () {
      return Courses.find( {}, { sort: { course: 1 } } );
    },

    /* room */

    rooms: function () {
      return Rooms.find( {}, { sort: { room: 1 } } );
    },

    /* techer */

    teachers: function () {
      return Teachers.find( {}, { sort: { teacher: 1 } } );
    },

    /* lesson */

    lessons: function () {

      var ins = Template.instance().data;
      var row = Rows.findOne( { schedule: ins.schedule, lessonnr: +ins.lessonnr} );

      console.log("ins & row: ", ins, row);
      return row ? row[ins.day] : [];
    }
  },
  events: {

    /* lesson */

    "click .js-add-lesson": function (e, t) {
      e.preventDefault();

      var course = $('input[name=courses]:checked').val();

      var roomCheckboxes = $(".js-select-room");
      var rooms = [];

      for(var i = 0; i < roomCheckboxes.length; i++) {
        if(roomCheckboxes[i].checked) {
          rooms.push(roomCheckboxes[i].value);
        }
      }

      var teacherCheckboxes = $(".js-select-teacher");
      var teachers = [];

      for(var i = 0; i < teacherCheckboxes.length; i++) {
        if(teacherCheckboxes[i].checked) {
          teachers.push(teacherCheckboxes[i].value);
        }
      }

      var query = {};

      query[this.day] = {
        "course": course,
        "room": rooms,
        "teacher": teachers
      };

      if(course && rooms.length > 0 && teachers.length > 0) {

        Meteor.call("lessonAdding", t.data.schedule, t.data.lessonnr, query);

        $("#addLessonModal").modal('hide');
      }
    },
    "click .js-remove-lesson": function (e, t) {
      e.preventDefault();

      var query = {};

      query[t.data.day] = {
        "course": this.course,
        "room": this.room,
        "teacher": this.teacher
      };

      Meteor.call("lessonRemoving", t.data.schedule, t.data.lessonnr, query);

      $("#addLessonModal").modal('hide');
    }
  }
});
