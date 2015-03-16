/*jshint node:true*/

var _ = require('lodash');
var ratings = require('./ratings').rating;

var GREEN = '\x1B[32m';
var RESET = '\033[0m';
var green = (text) => GREEN + text + RESET;

var values = _.values(ratings);

var collected = {};

console.log('Calculating ratings...');

values.forEach((item) => {
  _.forIn(item, (talkRating, talkId) => {
    var rating = parseInt(talkRating.votes);
    if (collected[talkId]) {
      collected[talkId].push(rating);
    } else {
      collected[talkId] = [rating];
    }
  });
});

var result = _.map(collected, (votes, talkId) => {
  var numberOfVotes = votes.length;
  var sum = votes.reduce((sum, vote) => sum + vote);

  return {
    talkId: talkId,
    numberOfVotes: numberOfVotes,
    score: sum / numberOfVotes
  };
});


var sortedResults = _.sortByOrder(result, 'score', false);
var winner = sortedResults[0];

console.log(sortedResults);
console.log(green('Winner:'));
console.log(green('Talk#: ' + winner.talkId + ', ' +
                  'score: ' + winner.score + ', ' +
                  'votes: ' + winner.numberOfVotes));
