Controller('modal', {
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

    schedule: function () {
      Session.get('recompute');
      return $("#addLessonModal").data('schedule');
    },

    day: function () {
      Session.get('recompute');
      return $("#addLessonModal").data('day');
    },

    lessonnr: function () {
      Session.get('recompute');
      return $("#addLessonModal").data('lessonnr');
    },

    lessons: function () {
      Session.get('recompute');

      var column = Columns.findOne( {
        schedule: $("#addLessonModal").data('schedule'),
        day: $("#addLessonModal").data('day'),
        lessonnr: +($("#addLessonModal").data('lessonnr')) } );

      return column ? column.lessons : [];
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

      if(course && rooms.length > 0 && teachers.length > 0) {

        var lesson = {
          "course": course,
          "room": rooms,
          "teacher": teachers
        };

        Meteor.call("lessonAdding",
          $("#addLessonModal").data('schedule'),
          $("#addLessonModal").data('lessonnr'),
          $("#addLessonModal").data('day'),
          lesson);

        $("#addLessonModal").modal('hide');
      }
    },
    "click .js-remove-lesson": function (e, t) {
      e.preventDefault();

      var lesson = {
        "course": this.course,
        "room": this.room,
        "teacher": this.teacher
      };

      Meteor.call("lessonRemoving",
        $("#addLessonModal").data('schedule'),
        $("#addLessonModal").data('lessonnr'),
        $("#addLessonModal").data('day'),
        lesson);

      $("#addLessonModal").modal('hide');
    }
  }
});
