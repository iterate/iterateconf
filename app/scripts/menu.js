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
    talks: document.getElementById('talks'),
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
      _onClick(uiCache.talks, toggleMenu);
    } else {
      _removeClick(uiCache.talks, toggleMenu);
    }
  };

  var toggleMenu = function () {
    if (_leftMenuToggled) {
      uiCache.leftMenu.style.left = '-' + menuWidth;
      uiCache.body.style.left = '0px';
      uiCache.topMenu.style.left = '0px';
      toggleMainContentClickHandler(false);
    } else {
      uiCache.leftMenu.style.left = '0px';
      uiCache.body.style.left = menuWidth;
      uiCache.topMenu.style.left = menuWidth;
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
