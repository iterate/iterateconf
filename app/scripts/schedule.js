/*jshint browser:true*/
/*global define*/
define(['data/talks', 'program', 'swipe'], function (talks, program, Swipe) {
  'use strict';
  var uiCache = {
    talks: document.getElementById('talks'),
    parallellTalks: null
  };

  var MAX_MOBILE_SIZE = 768;
  var MOBILE_MEDIA_QUERY = '(max-width: ' + MAX_MOBILE_SIZE + 'px)';

  var isMobile = (document.width < MAX_MOBILE_SIZE);
  var swipeElements = [];

  var _addSwipeToEl = function (el) {
    return new Swipe(el, { continuous: false });
  };

  var _getParalellTalksElements = function () {
    if (!uiCache.parallellTalks) {
      uiCache.parallellTalks = uiCache.talks.
        getElementsByClassName('parallell-talks');
    }
    return uiCache.parallellTalks;
  };

  var _removeSwipe = function () {
    if (!swipeElements.length) {
      return;
    }
    swipeElements.forEach(function (swipeObj) {
      swipeObj.kill();
    });
    swipeElements = [];
  };

  var _addSwipeToParallellTalks = function () {
    if (swipeElements.length) {
      return;
    }
    var els = _getParalellTalksElements();
    for (var i = 0; i < els.length; i++) {
      swipeElements.push(_addSwipeToEl(els[i]));
    }
  };

  var _onMediaChange = function (mq, options) {
    if (mq.matches) {
      options.entry && options.entry();
    } else {
      options.exit && options.exit();
    }
  };

  var initSwipe = function () {
    if (isMobile) {
      _addSwipeToParallellTalks();
    }
  };

  var addMediaListeners = function () {
    var hasMatchMediaSupport = (window.matchMedia !== undefined);
    if (hasMatchMediaSupport) {
      var mq = window.matchMedia(MOBILE_MEDIA_QUERY);
      mq.addListener(function () {
        _onMediaChange(mq, {
          entry: _addSwipeToParallellTalks,
          exit: _removeSwipe
        });
      });
    }
  };

  var init = function () {
    initSwipe();
    addMediaListeners();
  };

  return { init: init };
});
