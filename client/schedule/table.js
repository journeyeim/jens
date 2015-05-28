Controller('table', {
  rendered: function() {
  },
  helpers: {
    regHack: function ( bypass ) {

      var ins = Template.instance();

      Meteor.setTimeout( function () {
        registerDroppable( ins );
      }, 1000 );

      return bypass;
    },
    rows: function () {

      var rows = [];
      var schedule = Options.findOne( { key: "schedule" } ).value;

      for(var i = 1; i <= 15; i++) {
        rows.push( { schedule: schedule, lessonnr: i } );
      }

      return rows;
    },
    cells: function (schedule, lessonnr) {

      return Cells.find( { schedule: schedule, lessonnr: lessonnr }, { sort: { daynr: 1 } } );
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

var registerDroppable = function ( table ) {

  $( table.findAll( 'td' ) ).each( function( index, element ) {

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
