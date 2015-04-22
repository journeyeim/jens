Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function(){
  this.route('weeks', { path: '/' });
  this.route('students');
});
