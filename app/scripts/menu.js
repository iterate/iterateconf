/*jshint browser:true*/
/*global DocumentTouch*/

import { toHref } from 'smoothscroll';
import { roughTimeslots } from 'program';

var _leftMenuToggled = false;
var menuWidth = '160px';
var hasTouch = ('ontouchstart' in window) ||
    window.DocumentTouch && document instanceof DocumentTouch;

var uiCache = {
  btn: document.getElementById('menu-timeslots-btn'),
  body: document.body,
  mainContent: document.getElementById('main'),
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
  roughTimeslots.forEach(function (slot) {
    var item = document.createElement('a');
    item.href = '#slot-' + slot.id;
    item.textContent = slot.str;
    _onClick(item, toHref);
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

var toggleMenu = function (event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  if (_leftMenuToggled) {
    ['-webkit-', '-moz-', ''].forEach(function (vnd) {
      uiCache.mainContent.style[vnd + 'transform'] = '';
    });
    toggleMainContentClickHandler(false);
  } else {
    var transformCss = 'translate3d(' + menuWidth + ', 0px, 0px)';
    ['-webkit-', '-moz-', ''].forEach(function (vnd) {
      uiCache.mainContent.style[vnd + 'transform'] = transformCss;
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

export { init };
