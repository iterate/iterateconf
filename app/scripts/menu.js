/*jshint browser:true*/

import { roughTimeslots } from './program';
import { showScores } from './scoreboard';
import { onClick, removeClick } from './utils';

var _leftMenuToggled = false;
var menuWidth = '160px';

var uiCache = {
  btn: document.getElementById('menu-timeslots-btn'),
  body: document.body,
  main: document.getElementById('main'),
  mainContent: document.getElementById('main-content'),
  scoreboard: document.getElementById('scoreboard'),
  leftMenu: null
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

  var $stats = _buildMenuItem('Ratings', '#');
  onClick($stats, (e) => {
    e.preventDefault();
    showScores(uiCache.scoreboard);
  });
  nav.appendChild($stats);

  roughTimeslots.forEach((slot) => {
    nav.appendChild(_buildMenuItem(slot.str, '#slot-' + slot.id));
  });
  return nav;
};

var toggleMainContentClickHandler = (enable) => {
  if (enable) {
    onClick(uiCache.main, toggleMenu);
  } else {
    removeClick(uiCache.main, toggleMenu);
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
  onClick(uiCache.btn, toggleMenu);
};

addSideMenu();
bindMenuToggleBtn();
