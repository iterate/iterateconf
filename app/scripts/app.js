/*global define*/
define(['talks', 'program', 'swipe'], function (talks, program, Swipe) {
  'use strict';
  var uiCache = { 
    talks: document.getElementById('talks')
  };

  var isMobile = (document.width < 480);

  var getTalk = function (talkId) {
    var talk = talks[talkId];
    talk.user = talk.username.split("@")[0];
    talk.beskrivelse = talk.beskrivelse.replace('\n', '<br>');
    talk.img = "mennesker/" + talk.user + ".jpg";
    return talk;
  };

  var buildTalk = function (talkId) {
    var talk = getTalk(talkId);
    return [
      '<div class="row">',
      '  <article class="large-12 columns talk">',
      '    <h2>' + talk.title + '</h2>',
      '    <span class="byline">' + talk.username + '</span>',
      '    <p>' + talk.beskrivelse + '</p>',
      '    <img class="panel-profile" src="' + talk.img + '" />',
      '  </article>',
      '</div>'
    ].join('\n');
  };
  
  var buildParallell = function (talkId1, talkId2, fullWidth) {
    var talk1 = getTalk(talkId1);
    var talk2 = getTalk(talkId2);
    var classes = fullWidth
      ? 'parallell-article'
      : 'large-3 small-6 columns';

    return [
      '<div class="parallell-indicator">← swipe →</div>',
      '<div class="row parallell-talks">',
      '  <div class="parallell-wrap">',
      '    <div class="' + classes + ' talk">',
      '      <h2>' + talk1.title + '</h2>',
      '      <span class="byline">' + talk1.username + '</span>',
      '      <p>' + talk1.beskrivelse + '</p>',
      '      <img class="panel-profile" src="' + talk1.img + '" />',
      '    </div>',
      '    <div class="' + classes + ' talk">',
      '      <h2>' + talk2.title + '</h2>',
      '      <span class="byline">' + talk2.username + '</span>',
      '      <p>' + talk2.beskrivelse + '</p>',
      '      <img class="panel-profile" src="' + talk2.img + '" />',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
  };

  var addTalk = function (talkTempl) {
    var el = document.createElement('div');
    el.innerHTML = talkTempl;
    uiCache.talks.appendChild(el); 
    return el;
  };

  var initTalks = function () {
    console.log(talks);

    program.talksOrder.forEach(function (talksInSlot, i) {
      if (talksInSlot.length === 1) {
        addTalk(buildTalk(talksInSlot[0])); 
        return;
      }
      if (talksInSlot.length === 2) {
        var el = addTalk(buildParallell(talksInSlot[0], talksInSlot[1], isMobile)); 
        if (true || isMobile) {
          new Swipe(el.childNodes[2], { continuous: false });
        }
        return;
      }
    });
  };

  return { initTalks: initTalks };
});
