describe( "Course", function () {

  describe( "#new", function () {

    it( "should be created with name", function () {

        var course = new Course( "MOB", 13 );

        expect( course.name ).toBe( "MOB" );
    } );

    it( "should trim the name", function () {

        var course = new Course( " MOB ", 13 );

        expect( course.name ).toBe( "MOB" );
    } );

    it( "should set error if empty name entered", function () {

        var course = new Course( "", 13 );

        expect( course.error ).toBe( "Enter Name" );
    } );

    it( "should set NO error if entered name is not empty", function () {

        var course = new Course( "MOB", 13 );

        expect( course.error ).not.toBe( "Enter Name" );
    } );

    it( "should clear error if name is deleted by backspace", function () {

        var course = new Course( "", 8 );

        expect( course.error ).toBe( "" );
    } );

    it( "should check name on all keyup events not just on enter", function () {
        spyOn( Courses, "find" ).and.returnValue( { count: function() { return 1; } } );

        var course1 = new Course( "MOB", 8 );
        var course2 = new Course( "MOB", 13 );
        var course3 = new Course( "MOB", 32 );

        expect( course1.error ).toBe( "Double Entry" );
        expect( course2.error ).toBe( "Double Entry" );
        expect( course3.error ).toBe( "Double Entry" );
    } );

    it( "should set error if name already exists", function () {
        spyOn( Courses, "find" ).and.returnValue( { count: function() { return 1; } } );

        var course = new Course( "MOB", 13 );

        expect( course.error ).toBe( "Double Entry" );
    } );

    it( "should set NO error if name is unique", function () {
        spyOn( Courses, "find" ).and.returnValue( { count: function() { return 0; } } );

        var course1 = new Course( "MOB", 8 );
        var course2 = new Course( "MOB", 13 );
        var course3 = new Course( "MOB", 60 );

        expect( course1.error ).not.toBe( "Double Entry" );
        expect( course2.error ).not.toBe( "Double Entry" );
        expect( course3.error ).not.toBe( "Double Entry" );
    } );

    it( "should set NO error if everything is OK", function () {
        spyOn( Courses, "find" ).and.returnValue( { count: function() { return 0; } } );

        var course1 = new Course( "MOB", 13 );

        expect( course1.error ).toBe( "" );
    } );
  } );

  describe( "#save", function () {

    it( "should call the 'courseAdding' Meteor method with name parameter", function () {
        spyOn( Meteor, "call" );

        ( new Course( "MOB", 13 ) ).save();

        expect( Meteor.call ).toHaveBeenCalledWith( "courseAdding", "MOB" );
    } );

    it( "should not save when name is not defined", function () {

        expect( new Course( "", 13 ).save ).toThrow( "Name is not defined!" );
    } );

    /*
    it( "should not save when name is duplicate", function () {
        spyOn( Courses, "find" ).and.returnValue( { count: function() { return 1; } } );

        expect( new Course( "MOB", 13 ).save ).toThrow( "Implementation logic error!" );
    } );
    it( "should not save when keyCode is not enter", function () {

        expect( new Course( "MOB", 32 ).save ).toThrow( "KeyCode is not 'enter'!" );
    } );
    */
  } );
} );
