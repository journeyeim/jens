Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('schedules', { path: '/' });
  this.route('administration');
});

Router.onBeforeAction(function () {
  if (! Meteor.userId()) {
    this.render('login');
  }
  else {
    this.next();
  }
});
