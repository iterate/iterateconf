/*jshint browser:true*/
/*global DocumentTouch*/

import { roughTimeslots } from 'program';

var _leftMenuToggled = false;
var menuWidth = '160px';
var hasTouch = ('ontouchstart' in window) ||
    window.DocumentTouch && document instanceof DocumentTouch;
var tapEvent = hasTouch ? 'touchstart' : 'click';

var uiCache = {
  btn: document.getElementById('menu-timeslots-btn'),
  body: document.body,
  main: document.getElementById('main'),
  mainContent: document.getElementById('main-content'),
  leftMenu: null
};

var _onClick = function(el, handler) {
  el.addEventListener(tapEvent, handler, false);
};
var _removeClick = function(el, handler) {
  el.removeEventListener(tapEvent, handler, false);
};

var _buildMenuItem = function(str, link) {
    var $el = document.createElement('a');
    $el.href = link;
    $el.textContent = str;
    return $el;
};

var buildMenu = function() {
  var nav = document.createElement('nav');
  nav.className = 'menu-push';

  nav.appendChild(_buildMenuItem('Oversikt', '#section-welcome'));

  roughTimeslots.forEach(function (slot) {
    nav.appendChild(_buildMenuItem(slot.str, '#slot-' + slot.id));
  });
  return nav;
};

var toggleMainContentClickHandler = function(enable) {
  if (enable) {
    _onClick(uiCache.main, toggleMenu);
  } else {
    _removeClick(uiCache.main, toggleMenu);
  }
};

var toggleMenu = function(event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  if (_leftMenuToggled) {
    ['-webkit-', '-moz-', ''].forEach(function (vnd) {
      uiCache.main.style[vnd + 'transform'] = 'scale(1)';
    });
    toggleMainContentClickHandler(false);
  } else {
    var transformCss = 'translate3d(' + menuWidth + ', 0px, 0px)';
    ['-webkit-', '-moz-', ''].forEach(function (vnd) {
      uiCache.main.style[vnd + 'transform'] = transformCss;
    });
    toggleMainContentClickHandler(true);
  }
  _leftMenuToggled = !_leftMenuToggled;
};

var addSideMenu = function() {
  var nav = buildMenu();
  uiCache.body.appendChild(nav);
  uiCache.leftMenu = nav;
};

var bindMenuToggleBtn = function() {
  _onClick(uiCache.btn, toggleMenu);
};

addSideMenu();
bindMenuToggleBtn();
