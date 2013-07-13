/*global define*/
define(['program', 'smoothscroll'], function (program, smoothscroll) {
  'use strict';

  var _leftMenuToggled = false;
  var menuWidth = '160px';

  var uiCache = {
    btn: document.getElementById('menu-timeslots'),
    body: document.body,
    talks: document.getElementById('talks'),
    topMenu: document.getElementById('top-menu'),
    leftMenu: null
  };

  var buildMenu = function () {
    var nav = document.createElement('nav');
    nav.className = 'menu-push';
    program.roughTimeslots.forEach(function (slot) {
      var item = document.createElement('a');
      item.href = '#slot-' + slot.id;
      item.textContent = slot.str;
      item.onclick = smoothscroll.toHref
      nav.appendChild(item);
    });
    return nav;
  };

  var toggleMainContentClickHandler = function (enable) {
    if (enable) {
      uiCache.talks.onclick = toggleMenu;
    }
    else {
      uiCache.talks.onclick = null;
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

  function addSideMenu () {
    var nav = buildMenu();
    uiCache.body.appendChild(nav);
    uiCache.leftMenu = nav;
  };

  var bindGlobalUIEvents = function () {
    uiCache.btn.onclick = toggleMenu;
  };

  var init = function () {
    addSideMenu();
    bindGlobalUIEvents();
  };

  return { init: init };
});
