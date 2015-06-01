describe( "Authentication", function() {
  it( "should let to log in and out", function ( done ) {
    Meteor.loginWithPassword( "journeyeim@gmail.com", "1password", function( err ) {
      expect( err ).toBeUndefined();
      expect( Meteor.userId() ).not.toBeNull();

      Meteor.logout( function( err ) {
        expect( err ).toBeUndefined();
        expect( Meteor.userId() ).toBeNull();
        done();
      } );
    } );
  } );
  it( "should reject wrong credentials", function ( done ) {

    Meteor.loginWithPassword( "journeyeim@gmail.com", "2password", function( err ) {
      expect( err ).toBeDefined();
      done();
    } );
  } );
} );
