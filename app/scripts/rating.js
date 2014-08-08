/*jshint browser:true*/
/*globals console,Firebase,FirebaseSimpleLogin*/

import { firebaseStore, onLoginStateChanged } from 'firebase';

var domCache = {}, userId;

onLoginStateChanged((uId) => {
  userId = uId;
  firebaseStore.child(userId).once('value', setExistingVotes);
});

var setExistingVotes = (data) => {
  var ratings = data.val();
  if (!ratings) return;

  var $ratings = domCache.ratings || document.querySelectorAll('.rating');
  var voteToIdx = { 1: 3, 2: 2, 3: 1, 4: 0 };

  [...$ratings].forEach(($rating) => {
    var talkId = $rating.dataset.talkid;
    var rating = ratings[talkId];

    if (!rating) {
      return;
    }
    var votes = parseInt(rating.votes, 10);
    var idx = voteToIdx[votes];
    $rating.children[idx].classList.add('selected');
  });
};

var persistVote = (talkId, rating) => {
  if (!userId) {
    console.log('Missing user id, skipping sync');
    return;
  }
  firebaseStore.child(userId).child(talkId).set({ votes: rating });
};

var starClickHandler = (event) => {
  event.preventDefault();
  var $clickedStar = event.target;
  var $rating = $clickedStar.parentElement;
  var $stars = $rating.querySelectorAll('span');

  [...$stars].forEach(($star) => $star.classList.remove('selected'));

  $clickedStar.classList.add('selected');

  var rating = $clickedStar.dataset.val;
  var talkId = $rating.dataset.talkid;

  console.log('rate %s on talkid %s', rating, talkId);
  persistVote(talkId, rating);
};

var bindStarClicks = () => {
  var $ratings = domCache.ratings || document.querySelectorAll('.rating');
  [...$ratings].forEach(($rating) => {
    $rating.addEventListener('click', starClickHandler, false);
  });
};

var onWindowLoad = () => {
  bindStarClicks();
};

window.addEventListener('load', onWindowLoad, false);
