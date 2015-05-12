Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('schedules', { path: '/' });
  this.route('administration');
});
