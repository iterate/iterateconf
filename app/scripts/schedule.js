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

  var _addSwipe = function () {
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

  var _getTalk = function (talkId) {
    var talk = talks[talkId];
    var user = talk.username.split('@')[0];
    talk.beskrivelse = talk.beskrivelse.replace('\n', '<br>');
    talk.img = 'images/' + user + '.jpg';
    return talk;
  };

  var buildTalk = function (talkId, slotId) {
    var timeslot = program.timeslots[slotId];
    var talk = _getTalk(talkId);
    return [
      '<div class="timeslot" id="slot-' + slotId + '">' + timeslot + '</div>',
      '<div class="row">',
      '  <article class="large-12 columns">',
      '    <h2>' + talk.tittel + '</h2>',
      '    <div class="byline">' + talk.username + '</div>',
      '    <p class="text-col">' + talk.beskrivelse + '</p>',
      '    <figure class="profile">', //
      '      <img src="' + talk.img + '" />',
      '    </figure>',
      '  </article>',
      '</div>'
    ].join('\n');
  };

  var buildParallell = function (talkId1, talkId2, slotId) {
    var timeslot = program.timeslots[slotId];
    var buildParallellTalk = function (talk) {
      var tmpl = [
        '<div class="large-6 columns">',
        '  <h2>' + talk.tittel + '</h2>',
        '  <div class="byline">' + talk.username + '</div>',
        '  <p class="text-col">' + talk.beskrivelse + '</p>',
        '  <figure class="profile">',
        '    <img src="' + talk.img + '" />',
        '  </figure>',
        '</div>'
      ];
      if (talk.workshop) {
        var workshopWarning = '<div class="workshop">Behold! A workshop.</div>';
        tmpl.splice(3, 0, workshopWarning);
      }
      return tmpl.join('\n');
    };

    return [
      '<div class="timeslot parallell-indicator" id="slot-' + slotId + '">',
      timeslot + '</div>',
      '<div class="row parallell-talks">',
      '  <div class="parallell-wrap">',
      buildParallellTalk(_getTalk(talkId1)),
      buildParallellTalk(_getTalk(talkId2)),
      '  </div>',
      '</div>'
    ].join('\n');
  };

  var addTalk = function (talkTempl) {
    var el = document.createElement('section');
    el.className = 'talk';
    el.innerHTML = talkTempl;
    uiCache.talks.appendChild(el);
    return el;
  };

  var initTalks = function () {
    program.talksOrder.forEach(function (talksInSlot, i) {
      if (talksInSlot.length === 1) {
        addTalk(buildTalk(talksInSlot[0], i));
        return;
      }
      if (talksInSlot.length === 2) {
        var el = addTalk(buildParallell(talksInSlot[0], talksInSlot[1], i));
        if (isMobile) {
          swipeElements.push(_addSwipeToEl(el.childNodes[2]));
        }
        return;
      }
    });
  };

  var addMediaListeners = function () {
    var hasMatchMediaSupport = (window.matchMedia !== undefined);
    if (hasMatchMediaSupport) {
      var mq = window.matchMedia(MOBILE_MEDIA_QUERY);
      mq.addListener(function () {
        _onMediaChange(mq, { entry: _addSwipe, exit: _removeSwipe });
      });
    }
  };

  var init = function () {
    initTalks();
    addMediaListeners();
  };

  return { init: init };
});
