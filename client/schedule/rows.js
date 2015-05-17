Controller('rows', {
  created: function() {
    this.schedule = new ReactiveVar(null);
    this.day = new ReactiveVar(null);
    this.lessonnr = new ReactiveVar(null);
  },
  rendered: function() {
    registerDroppable(this);
  },
  helpers: {
    rows: function () {

      var id = Options.findOne( { key: "schedule" } ).value;
      var name = Schedules.findOne( { _id: id }).schedule;

      return Rows.find( { schedule: name }, { sort: { lessonnr: 1 } } );
    },
    days: function () {
      return ["Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday"];
    },
    modalSchedule: function () {
      return Template.instance().schedule.get();
    },
    modalDay: function () {
      return Template.instance().day.get();
    },
    modalLessonnr: function () {
      return Template.instance().lessonnr.get();
    }
  },
  events: {
    "dblclick td": function (e, t) {
      e.preventDefault();
      e.stopPropagation();

      t.schedule.set(e.currentTarget.dataset.schedule);
      t.day.set(e.currentTarget.dataset.day);
      t.lessonnr.set(e.currentTarget.dataset.lessonnr);

      $("#addLessonModal").modal('show');
    },

    /* workaround for :hover bug in webkit part 1/2 */
    "mouseover td": function (e) {
      e.currentTarget.className = "js-draggable-hover";
    },
    "mouseout td": function (e) {
      e.currentTarget.className = "";
    }
  }
});

var registerDroppable = function (template) {

  $(template.findAll('td')).each(function(index, element) {

    $(element).droppable({
      accept: ".js-lesson",
      addClasses: false,
      hoverClass: ".js-draggable-hover",
      drop: function (e, ui) {

        var target = e.target.dataset;
        var source = ui.draggable[0].dataset;

        var lesson = {
          "course": source.course,
          "room": source.room,
          "teacher": source.teacher
        };

        if(target.lessonnr !== source.lessonnr || target.day !== source.day) {

          var pushQuery = {};
          pushQuery[target.day] = lesson;
          Meteor.call("lessonAdding", target.schedule, target.lessonnr, pushQuery);

          if(! e.ctrlKey) {
            var pullQuery = {};
            pullQuery[source.day] = lesson;
            Meteor.call("lessonRemoving", target.schedule, source.lessonnr, pullQuery);
          }
        }

        /* workaround for :hover bug in webkit part 2/2 */
        $('td').each(function(index, element) {
          element.className = "";
        });
      }
    });
  });
}
