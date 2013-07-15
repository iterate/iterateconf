/*global require*/
require.config({
  paths: {
    jquery: 'libs/jquery',
    swipe: 'libs/swipe'
  }
});

require(['app', 'menu'], function (app, menu) {
  'use strict';
  app.initTalks();
  menu.init();
});
