/*jshint browser:true*/
/*globals console*/

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
};


var bindStarClicks = () => {
  var $ratings = document.querySelectorAll('.rating');
  [...$ratings].forEach(($rating) => {
    $rating.addEventListener('click', starClickHandler, false);
  });
};

window.addEventListener('load', bindStarClicks, false);
