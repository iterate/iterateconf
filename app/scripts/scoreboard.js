/*jshint browser:true*/
/*globals console*/

import { firebaseStore } from 'firebase';

var talks;
window.SCORES = talks;

var onScoresFetched = (data) => {
  talks = {};
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
};

var showScores = ($el) => {
  firebaseStore.once('value', onScoresFetched);
};

export { showScores };
