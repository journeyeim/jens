Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function(){
  this.route('week', { path: '/' });
  this.route('students');
});
