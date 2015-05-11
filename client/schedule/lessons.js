Controller('lessons', {
  rendered: function() {
  },
  helpers: {
    regDraggable: function (realParam) {

      var template = Template.instance();

      Meteor.defer(function () {
        registerDraggable(template);
      });

      return realParam;
    }
  },
  events: {
  }
});

var registerDraggable = function (template) {

  $(template.findAll('.js-lesson')).each(function (index, element) {

    $(element).draggable({
      addClasses: false,
      containment: '.js-table',
      distance: 10,
      helper: 'clone',
      opacity: 0.8,
      start: function (e, ui) {

        console.log("draggable start");
      }
    });
  });
}
