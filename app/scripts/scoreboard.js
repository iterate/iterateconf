/*jshint browser:true*/
/*globals console*/

import { firebaseStore } from 'firebase';

var domCache = {};

// FIXME TODO XXX: Should get the title by some other means..
var getTalkTitle = (talkId) => {
  var talkEl = document.getElementById('talk-' + talkId);
  return talkEl ? talkEl.querySelector('h2').textContent : '';
};

var renderResult = (talks) => {
  var $container = domCache.container;
  $container.innerHTML = '';

  for (var talkId in talks) {
    var title = getTalkTitle(talkId);
    var talk = talks[talkId];
    var numberOfVotes = talk.length;
    var score = talk.reduce((memo, v) => v + memo, 0) / numberOfVotes;
    var $el = document.createElement('div');
    $el.textContent = '"' + title + '" got ' + numberOfVotes + ' vote(s) ' +
      'averaging at ' + score.toFixed(2) + ' points.';
    $container.appendChild($el);
  }
};

var onScoresFetched = (data) => {
  var talks = {};
  data.forEach((user) => {
    user.forEach((talk) => {
      var talkId = talk.name();
      if (!talks[talkId]) {
        talks[talkId] = [];
      }
      var votes = parseInt(talk.val().votes, 10);
      talks[talkId].push(votes);
    });
  });

  renderResult(talks);
};

var showScores = ($el) => {
  domCache.container = $el;
  firebaseStore.on('value', onScoresFetched);
};

export { showScores };
