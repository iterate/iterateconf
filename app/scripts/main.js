require.config({
  paths: {
    jquery: 'libs/jquery'
  },
  shim: {
    swipe: { exports: 'Swipe' }
  }
});

require(['app', 'menu'], function (app, menu) {
  'use strict';
  app.initTalks();
  menu.init();
});
