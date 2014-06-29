/*jshint browser:true*/

import { onClick, removeClick } from 'utils';

import { firebaseStore } from 'firebase';

var domCache = {};

// FIXME: Should get the title by some other means..
var getTalkTitle = (talkId) => {
  var talkEl = document.getElementById('talk-' + talkId);
  var title = talkEl ? talkEl.querySelector('h2').textContent : '';
  var $el = document.createElement('strong');
  $el.textContent = title;
  return $el;
};

var onCloseClick = function onCloseClick(e) {
  e.preventDefault();
  domCache.container.style.display = 'none';
  removeClick(e.target, onCloseClick);
};

var renderResult = (talks, $container) => {
  $container.innerHTML = '';

  var $closeBtn = document.createElement('button');
  $closeBtn.classList.add('close');
  $closeBtn.textContent = '×';
  $container.appendChild($closeBtn);
  onClick($closeBtn, onCloseClick);

  var $talks = document.createElement('div');
  $talks.classList.add('scores-talks');

  for (var talkId in talks) {
    var $title = getTalkTitle(talkId);

    var talk = talks[talkId];
    var numberOfVotes = talk.length;

    if (numberOfVotes < 3) {
      continue;
    }

    var score = talk.reduce((memo, v) => v + memo, 0) / numberOfVotes;
    var $stats = document.createTextNode(' har ' + numberOfVotes +
                                         ' stemmer, med snitt på ' +
                                         score.toFixed(2) + ' stjerner.');

    var $el = document.createElement('p');
    $el.appendChild($title);
    $el.appendChild($stats);
    $talks.appendChild($el);
  }

  $container.appendChild($talks);
  $container.style.display = 'block';
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

  renderResult(talks, domCache.container);
};

var showScores = ($el) => {
  domCache.container = $el;
  firebaseStore.on('value', onScoresFetched);
};

export { showScores };
