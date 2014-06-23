/*jshint browser:true*/
/*global DocumentTouch*/

import { roughTimeslots } from 'program';
import { showScores } from 'scoreboard';

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
  scoreboard: document.getElementById('scoreboard'),
  leftMenu: null
};

var _onClick = (el, handler) => {
  el.addEventListener(tapEvent, handler, false);
};
var _removeClick = (el, handler) => {
  el.removeEventListener(tapEvent, handler, false);
};

var _buildMenuItem = (str, link) => {
  var $el = document.createElement('a');
  $el.href = link;
  $el.textContent = str;
  return $el;
};

var buildMenu = () => {
  var nav = document.createElement('nav');
  nav.className = 'menu-push';

  nav.appendChild(_buildMenuItem('Oversikt', '#section-welcome'));


  roughTimeslots.forEach((slot) => {
    nav.appendChild(_buildMenuItem(slot.str, '#slot-' + slot.id));
  });

  var $stats = _buildMenuItem('Stemmer', '#');
  _onClick($stats, (e) => {
    e.preventDefault();
    showScores(uiCache.scoreboard);
  });
  nav.appendChild($stats);
  return nav;
};

var toggleMainContentClickHandler = (enable) => {
  if (enable) {
    _onClick(uiCache.main, toggleMenu);
  } else {
    _removeClick(uiCache.main, toggleMenu);
  }
};

var toggleMenu = (event) => {
  event.stopImmediatePropagation();
  event.preventDefault();

  if (_leftMenuToggled) {
    ['-webkit-', '-moz-', ''].forEach((vnd) => {
      uiCache.main.style[vnd + 'transform'] = 'scale(1)';
    });
    toggleMainContentClickHandler(false);
  } else {
    var transformCss = 'translate3d(' + menuWidth + ', 0px, 0px)';
    ['-webkit-', '-moz-', ''].forEach((vnd) => {
      uiCache.main.style[vnd + 'transform'] = transformCss;
    });
    toggleMainContentClickHandler(true);
  }
  _leftMenuToggled = !_leftMenuToggled;
};

var addSideMenu = () => {
  var nav = buildMenu();
  uiCache.body.appendChild(nav);
  uiCache.leftMenu = nav;
};

var bindMenuToggleBtn = () => {
  _onClick(uiCache.btn, toggleMenu);
};

addSideMenu();
bindMenuToggleBtn();
