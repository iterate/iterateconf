/*global define*/
define(['program', 'smoothscroll'], function (program, smoothscroll) {
  'use strict';

  var _leftMenuToggled = false;
  var menuWidth = '120px';

  var uiCache = {
    btn: document.getElementById('menu-timeslots'),
    body: document.body,
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

  var toggleMenu = function () {
    if (_leftMenuToggled) {
      uiCache.leftMenu.style.left = '-' + menuWidth;
      uiCache.body.style.left = '0px';
      uiCache.topMenu.style.left = '0px';
    } else {
      uiCache.leftMenu.style.left = '0px';
      uiCache.body.style.left = menuWidth;
      uiCache.topMenu.style.left = menuWidth;
    }
    _leftMenuToggled = !_leftMenuToggled;
  };

  var addSideMenu = function () {
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
