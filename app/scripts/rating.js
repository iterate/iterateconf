/*jshint browser:true*/
/*globals console,Firebase,FirebaseSimpleLogin*/

var userId,
    domCache = {};

// Set up Firebase
var userId;
var firebaseStore = new Firebase('https://iterateconf.firebaseio.com/rating');
var firebaseAuth = new FirebaseSimpleLogin(firebaseStore, (error, user) => {
  if (error) {
    console.log('Firebase error', error);
  } else if (user) {
    console.log('Re-using user object', user);
    userId = user.id;
    firebaseStore.child(userId).once('value', setExistingVotes);
  } else {
    console.log('Creating user object');
    firebaseAuth.login('anonymous', { rememberMe: true });
  }
});

window.fire = firebaseStore;

var setExistingVotes = (data) => {
  var ratings = data.val();
  var $ratings = domCache.ratings || document.querySelectorAll('.rating');
  var voteToIdx = { 1: 4, 2: 3, 3: 2, 4: 1 };

  [...$ratings].forEach(($rating) => {
    var talkId = $rating.dataset.talkid;
    var rating = ratings[talkId];

    if (!rating) {
      return;
    }
    var votes = parseInt(rating.votes, 10);
    var idx = voteToIdx[votes];
    $rating.childNodes[idx].classList.add('selected');
  });
};

var onPersist = (error) => {
  if (error) console.log('Sync failed', error);
};

var persistVote = (talkId, rating) => {
  if (!userId) {
    console.log('Missing user id, skipping sync and try to re-login..');
    firebaseAuth.login('anonymous', { rememberMe: true });
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
var loginUser = () => {
  console.log('Firebase auth obj', firebaseAuth);
  if (firebaseAuth.id) {
    userId = firebaseAuth.id;
  } else {
    console.log('Loggin in..');
    firebaseAuth.login('anonymous', { rememberMe: true });
  }
};

var onWindowLoad = () => {
  bindStarClicks();
  //window.setTimeout(loginUser, 1000);
};

window.addEventListener('load', onWindowLoad, false);
