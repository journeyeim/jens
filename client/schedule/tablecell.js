Controller('tablecell', {
  rendered: function() {
  },
  helpers: {
    regDraggable: function (triggerOnly) {

      var template = Template.instance();

      Meteor.defer(function () {
        registerDraggable(template);
      });

      return triggerOnly;
    },
    conflictClass: function () {

      return this.conflict ? "js-conflict" : "";
    },
    conflictText: function () {

      return this.conflict;
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
      opacity: 0.8
    });
  });
}
