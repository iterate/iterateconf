/*global require*/
require.config({
  paths: {
    jquery: 'libs/jquery'
  }
});

require(['menu'], function (menu) {
  'use strict';
  menu.init();
});
