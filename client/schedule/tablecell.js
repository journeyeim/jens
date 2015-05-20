Controller('tablecell', {
  rendered: function() {
  },
  helpers: {
    regHack: function ( bypass ) {

      var ins = Template.instance();

      Meteor.setTimeout( function () {
        registerDraggable( ins );
      }, 1000 );

      return bypass;
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

var registerDraggable = function ( template ) {

  $( template.findAll( '.js-lesson' ) ).each( function ( index, element ) {

    $(element).draggable({
      addClasses: false,
      containment: '.js-table',
      distance: 10,
      helper: 'clone',
      opacity: 0.8
    });
  });
}
