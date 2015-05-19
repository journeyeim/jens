Controller('table', {
  rendered: function() {
    registerDroppable(this);
  },
  helpers: {
    rows: function () {

      var id = Options.findOne( { key: "schedule" } ).value;
      var schedule = Schedules.findOne( { _id: id }).schedule;

      return Rows.find( { schedule: schedule }, { sort: { lessonnr: 1 } } );
    },
    columns: function (schedule, lessonnr) {

      return Columns.find( { schedule: schedule, lessonnr: lessonnr }, { sort: { daynr: 1 } } );
    },
    days: function () {
      return [ "Monday",
               "Tuesday",
               "Wednesday",
               "Thursday",
               "Friday" ];
    }
  },
  events: {
    "dblclick td": function (e, t) {
      e.preventDefault();
      e.stopPropagation();

      $("#addLessonModal").data('schedule', e.currentTarget.dataset.schedule);
      $("#addLessonModal").data('day', e.currentTarget.dataset.day);
      $("#addLessonModal").data('lessonnr', e.currentTarget.dataset.lessonnr);
      Session.set('recompute', new Date());

      $("#addLessonModal").modal('show');
    }
  }
});

var registerDroppable = function (template) {

  $(template.findAll('td')).each(function(index, element) {

    $(element).droppable({
      accept: ".js-lesson",
      addClasses: false,
      drop: function (e, ui) {

        var target = e.target.dataset;
        var source = ui.draggable[0].dataset;

        if(target.lessonnr !== source.lessonnr || target.day !== source.day) {

          var lesson = {
            "course": source.course,
            "room": source.room.split(","),
            "teacher": source.teacher.split(",")
          };

          Meteor.call("lessonAdding", target.schedule, target.lessonnr, target.day, lesson);

          if(! e.ctrlKey) {
            Meteor.call("lessonRemoving", target.schedule, source.lessonnr, source.day, lesson);
          }
        }
      }
    });
  });
}
