require.config({
  paths: {
    jquery: 'libs/jquery'
  },
  shim: {
    swipe: { exports: 'Swipe' }
  }
});

require(['app'], function (app, $) {
  'use strict';
  app.initTalks();
});
