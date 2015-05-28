describe( "Login template", function() {
  it( "shows 'Please, log in!' heading", function() {
    /*
    var div = document.createElement( "DIV" );
        Blaze.render( Template.login, div );

        expect( $( div ).find( "h4" )[ 0 ].text ).toEqual( 'Please, log in!' );
    */
    expect( $( "h4" ).text() ).toEqual( "Please, log in!" );
  } );
} );
