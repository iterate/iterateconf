(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*jshint browser:true*/
/*globals console,Firebase,FirebaseSimpleLogin*/

var userId;
var _authHandlers = [];

var firebaseUrl = 'https://blinding-inferno-697.firebaseio.com/rating';

var firebaseStore = new Firebase(firebaseUrl);

var firebaseAuth = new FirebaseSimpleLogin(firebaseStore, function (error, user) {
  if (error) {
    console.log('Firebase error', error);
  } else if (user) {
    console.log('Got user object', user);
    userId = user.id;
    _authHandlers.forEach(function (cb) {
      return cb(userId);
    });
  } else {
    console.log('Creating user object');
    firebaseAuth.login('anonymous', { rememberMe: true });
  }
});

var onLoginStateChanged = function onLoginStateChanged(callback) {
  _authHandlers.push(callback);
};

window.fire = firebaseStore;

exports.firebaseStore = firebaseStore;
exports.onLoginStateChanged = onLoginStateChanged;

},{}],2:[function(require,module,exports){
'use strict';

require('./menu');

// import './rating';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(function () {
    return console.log('Service Worker Registered!');
  });
} /*jshint browser:true, devel:true */

},{"./menu":3}],3:[function(require,module,exports){
'use strict';

var _program = require('./program');

var _scoreboard = require('./scoreboard');

var _utils = require('./utils');

var _leftMenuToggled = false; /*jshint browser:true*/

var menuWidth = '160px';

var uiCache = {
  btn: document.getElementById('menu-timeslots-btn'),
  body: document.body,
  main: document.getElementById('main'),
  mainContent: document.getElementById('main-content'),
  scoreboard: document.getElementById('scoreboard'),
  leftMenu: null
};

var _buildMenuItem = function _buildMenuItem(str, link) {
  var $el = document.createElement('a');
  $el.href = link;
  $el.textContent = str;
  return $el;
};

var buildMenu = function buildMenu() {
  var nav = document.createElement('nav');
  nav.className = 'menu-push';

  nav.appendChild(_buildMenuItem('Oversikt', '#section-welcome'));

  // var $stats = _buildMenuItem('Ratings', '#');
  // onClick($stats, (e) => {
  //   e.preventDefault();
  //   showScores(uiCache.scoreboard);
  // });
  // nav.appendChild($stats);

  _program.roughTimeslots.forEach(function (slot) {
    nav.appendChild(_buildMenuItem(slot.str, '#slot-' + slot.id));
  });
  return nav;
};

var toggleMainContentClickHandler = function toggleMainContentClickHandler(enable) {
  if (enable) {
    (0, _utils.onClick)(uiCache.main, toggleMenu);
  } else {
    (0, _utils.removeClick)(uiCache.main, toggleMenu);
  }
};

var toggleMenu = function toggleMenu(event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  if (_leftMenuToggled) {
    ['-webkit-', '-moz-', ''].forEach(function (vnd) {
      uiCache.main.style[vnd + 'transform'] = 'scale(1)';
    });
    toggleMainContentClickHandler(false);
  } else {
    var transformCss = 'translate3d(' + menuWidth + ', 0px, 0px)';
    ['-webkit-', '-moz-', ''].forEach(function (vnd) {
      uiCache.main.style[vnd + 'transform'] = transformCss;
    });
    toggleMainContentClickHandler(true);
  }
  _leftMenuToggled = !_leftMenuToggled;
};

var addSideMenu = function addSideMenu() {
  var nav = buildMenu();
  uiCache.body.appendChild(nav);
  uiCache.leftMenu = nav;
};

var bindMenuToggleBtn = function bindMenuToggleBtn() {
  (0, _utils.onClick)(uiCache.btn, toggleMenu);
};

addSideMenu();
bindMenuToggleBtn();

},{"./program":4,"./scoreboard":5,"./utils":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var roughTimeslots = [{ str: '09:00 - 10:00', id: 0 }, { str: '10:15 - 10:55', id: 3 }, { str: '11:10 - 12:00', id: 7 }, { str: '13:00 - 14:00', id: 12 }, { str: '14:15 - 15:15', id: 15 }, { str: '15:30 - 16:30', id: 18 }];

exports.roughTimeslots = roughTimeslots;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showScores = undefined;

var _utils = require('./utils');

var _firebase = require('./firebase');

/*jshint browser:true*/

var domCache = {};

// FIXME: Should get the title by some other means..
var getTalkTitle = function getTalkTitle(talkId) {
  var talkEl = document.getElementById('talk-' + talkId);
  var title = talkEl ? talkEl.querySelector('h2').textContent : '';
  var $el = document.createElement('strong');
  $el.textContent = title;
  return $el;
};

var onCloseClick = function onCloseClick(e) {
  e.preventDefault();
  domCache.container.style.display = 'none';
  (0, _utils.removeClick)(e.target, onCloseClick);
};

var renderResult = function renderResult(talks, $container) {
  $container.innerHTML = '';

  var $closeBtn = document.createElement('button');
  $closeBtn.classList.add('close');
  $closeBtn.textContent = '×';
  $container.appendChild($closeBtn);
  (0, _utils.onClick)($closeBtn, onCloseClick);

  var $talks = document.createElement('div');
  $talks.classList.add('scores-talks');

  for (var talkId in talks) {
    var $title = getTalkTitle(talkId);

    var talk = talks[talkId];
    var numberOfVotes = talk.length;

    if (numberOfVotes < 3) {
      continue;
    }

    var score = talk.reduce(function (memo, v) {
      return v + memo;
    }, 0) / numberOfVotes;
    var $stats = document.createTextNode(' har ' + numberOfVotes + ' stemmer, med snitt på ' + score.toFixed(2) + ' stjerner.');

    var $el = document.createElement('p');
    $el.appendChild($title);
    $el.appendChild($stats);
    $talks.appendChild($el);
  }

  $container.appendChild($talks);
  $container.style.display = 'block';
};

var onScoresFetched = function onScoresFetched(data) {
  var talks = {};
  data.forEach(function (user) {
    user.forEach(function (talk) {
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

var showScores = function showScores($el) {
  domCache.container = $el;
  _firebase.firebaseStore.on('value', onScoresFetched);
};

exports.showScores = showScores;

},{"./firebase":1,"./utils":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*jshint browser:true*/
/*global DocumentTouch*/

var hasTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
var tapEvent = hasTouch ? 'touchstart' : 'click';

var onClick = function onClick(el, handler) {
  el.addEventListener(tapEvent, handler, false);
};
var removeClick = function removeClick(el, handler) {
  el.removeEventListener(tapEvent, handler, false);
};

exports.onClick = onClick;
exports.removeClick = removeClick;

},{}]},{},[2]);
