/*global require*/
require.config({
  paths: {
    jquery: 'libs/jquery',
    swipe: 'libs/swipe'
  }
});

require(['schedule', 'menu'], function (schedule, menu) {
  'use strict';
  schedule.init();
  menu.init();
});
