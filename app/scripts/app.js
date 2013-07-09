/*global define*/
define(['talks', 'program', 'swipe'], function (talks, program, Swipe) {
  'use strict';
  var uiCache = {
    talks: document.getElementById('talks')
  };

  var isMobile = (document.width < 480);

  var getTalk = function (talkId) {
    var talk = talks[talkId];
    talk.user = talk.username.split('@')[0];
    talk.beskrivelse = talk.beskrivelse.replace('\n', '<br>');
    talk.img = 'mennesker/' + talk.user + '.jpg';
    return talk;
  };

  var buildTalk = function (talkId, slotId) {
    var timeslot = program.timeslots[slotId];
    var talk = getTalk(talkId);
    return [
      '<div class="timeslot" id="slot-' + slotId + '">' + timeslot + '</div>',
      '<div class="row">',
      '  <article class="large-12 columns">',
      '    <h2>' + talk.title + '</h2>',
      '    <span class="byline">' + talk.username + '</span>',
      '    <p>' + talk.beskrivelse + '</p>',
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
      return [
        '<div class="large-6 columns">',
        '  <h2>' + talk.title + '</h2>',
        '  <span class="byline">' + talk.username + '</span>',
        '  <p>' + talk.beskrivelse + '</p>',
        '  <figure class="profile">',
        '    <img src="' + talk.img + '" />',
        '  </figure>',
        '</div>',
      ].join('\n');
    };

    return [
      '<div class="timeslot parallell-indicator" id="slot-' + slotId + '">' + timeslot + '</div>',
      '<div class="row parallell-talks">',
      '  <div class="parallell-wrap">',
      buildParallellTalk(getTalk(talkId1)),
      buildParallellTalk(getTalk(talkId2)),
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
          new Swipe(el.childNodes[2], { continuous: false });
        }
        return;
      }
    });
  };

  return { initTalks: initTalks };
});
