/*jshint browser:true*/
/*global define,DocumentTouch*/
define(['program', 'smoothscroll'], function (program, smoothscroll) {
  'use strict';

  var _leftMenuToggled = false;
  var menuWidth = '160px';
  var hasTouch = ('ontouchstart' in window) ||
      window.DocumentTouch && document instanceof DocumentTouch;

  var uiCache = {
    btn: document.getElementById('menu-timeslots-btn'),
    body: document.body,
    mainContent: document.getElementById('main-content'),
    topMenu: document.getElementById('top-menu'),
    leftMenu: null
  };

  var _onClick = function (el, handler) {
    var event = hasTouch ? 'touchstart' : 'click';
    el.addEventListener(event, handler, false);
  };
  var _removeClick = function (el, handler) {
    var event = hasTouch ? 'touchstart' : 'click';
    el.removeEventListener(event, handler, false);
  };

  var buildMenu = function () {
    var nav = document.createElement('nav');
    nav.className = 'menu-push';
    program.roughTimeslots.forEach(function (slot) {
      var item = document.createElement('a');
      item.href = '#slot-' + slot.id;
      item.textContent = slot.str;
      _onClick(item, smoothscroll.toHref);
      nav.appendChild(item);
    });
    return nav;
  };

  var toggleMainContentClickHandler = function (enable) {
    if (enable) {
      _onClick(uiCache.mainContent, toggleMenu);
    } else {
      _removeClick(uiCache.mainContent, toggleMenu);
    }
  };

  var toggleMenu = function () {
    if (_leftMenuToggled) {
      ['-webkit-', '-moz-', ''].forEach(function (vnd) {
        uiCache.body.style[vnd + 'transform'] = '';
      });
      toggleMainContentClickHandler(false);
    } else {
      ['-webkit-', '-moz-', ''].forEach(function (vnd) {
        var transformCss = 'translate(' + menuWidth + ', 0px)';
        uiCache.body.style[vnd + 'transform'] = transformCss;
      });
      toggleMainContentClickHandler(true);
    }
    _leftMenuToggled = !_leftMenuToggled;
  };

  var addSideMenu = function () {
    var nav = buildMenu();
    uiCache.body.appendChild(nav);
    uiCache.leftMenu = nav;
  };

  var bindGlobalUIEvents = function () {
    _onClick(uiCache.btn, toggleMenu);
  };

  var init = function () {
    addSideMenu();
    bindGlobalUIEvents();
  };

  return { init: init };
});
