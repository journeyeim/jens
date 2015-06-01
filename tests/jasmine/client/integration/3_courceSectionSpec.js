describe( "Course Section", function() {

  beforeEach(function ( done ) {
    Meteor.loginWithPassword("journeyeim@gmail.com", "1password", function( err ) {
      Router.go( 'administration' );
      Tracker.afterFlush( done );
    } );
  } );

  afterEach( function( done ) {
    Meteor.logout( function() {
      done();
    } );
  } );

  it( "displays courses", function() {
    expect( $( '.js-remove-course' ).length ).toEqual( 2 );
  } );
} );
