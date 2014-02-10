/*jshint node:true*/
var fs = require('fs');

var cheerio = require('cheerio');
var Tabletop = require('tabletop');

var program = require('./program');

var RED = '\033[31m';
var GREEN = '\x1B[32m';
var RESET = '\033[0m';

var PROGRAM_SPREADSHEET_KEY = '0ApxuzZeYd8qddEpXVkFaVng1MHFmSFdyaXVabzQyaUE';
var TALKSHTML = 'app/index.html';
var TALKSID = '#talks';

var clean = function (data) {
  return data.map(function (talk) {
    talk.workshop = talk.workshop === '1' ? true : false;
    return talk;
  });
};

var _getTalk = function (talkId, talks) {
  var talk = talks[talkId];
  var user = talk.username.split('@')[0];
  talk.beskrivelse = talk.beskrivelse.replace('\n', '<br>');
  talk.img = 'images/' + user + '.jpg';
  return talk;
};

var buildTalk = function (talkId, slotId, talks) {
  var timeslot = program.timeslots[slotId];
  var talk = _getTalk(talkId, talks);
  return [
    '<div class="timeslot" id="slot-' + slotId + '">' + timeslot + '</div>',
    '<div class="row">',
    '  <article class="large-12 columns">',
    '    <h2>' + talk.tittel + '</h2>',
    '    <div class="byline">' + talk.username + '</div>',
    '    <p class="text-col">' + talk.beskrivelse + '</p>',
    '    <figure class="profile">', //
    '      <img src="' + talk.img + '" />',
    '    </figure>',
    '  </article>',
    '</div>'
  ].join('\n');
};

var buildParallell = function (talkId1, talkId2, slotId, data) {
  var timeslot = program.timeslots[slotId];
  var buildParallellTalk = function (talk) {
    var tmpl = [
      '<div class="large-6 columns">',
      '  <h2>' + talk.tittel + '</h2>',
      '  <div class="byline">' + talk.username + '</div>',
      '  <p class="text-col">',
      talk.beskrivelse,
      '  </p>',
      '  <figure class="profile">',
      '    <img src="' + talk.img + '" />',
      '  </figure>',
      '</div>'
    ];
    if (talk.workshop) {
      var workshopWarning = '    ';
      workshopWarning += '<div class="workshop">* This is a workshop. *</div>';
      tmpl.splice(3, 0, workshopWarning);
    }
    return tmpl.join('\n');
  };

  return [
    '<div class="timeslot parallell-indicator" id="slot-' + slotId + '">',
    timeslot + '</div>',
    '<div class="row parallell-talks">',
    '  <div class="parallell-wrap">',
    buildParallellTalk(_getTalk(talkId1, data)),
    buildParallellTalk(_getTalk(talkId2, data)),
    '  </div>',
    '</div>'
  ].join('\n');
};

var addTalk = function (talkTempl) {
  var el = '<section class="talk">\n';
  el += talkTempl;
  el += '\n</section>';
  return el;
};


var genereateHtml = function (data) {
  var html = '';
  var numberOfTalks = 0;
  program.talksOrder.forEach(function (talksInSlot, i) {
    html += '\n';
    if (talksInSlot.length === 1) {
      html += addTalk(buildTalk(talksInSlot[0], i, data));
      numberOfTalks += 1;
    }
    if (talksInSlot.length === 2) {
      html += addTalk(buildParallell(talksInSlot[0], talksInSlot[1], i, data));
      numberOfTalks += 2;
    }
  });
  html += '\n';

  console.log(numberOfTalks + ' talks in schedule…');
  return html;
};

var writeHTML = function (talksHtml, filename, htmlId) {
  var html = fs.readFile(filename, function (err, data) {
    if (err) { throw err; }
    var $ = cheerio.load(data);
    $(htmlId).html(talksHtml);
    fs.writeFile(filename, $.html(), function (err) {
      if (err) { throw err; }
      console.log(GREEN + 'Talks successfully injected → ' + filename + RESET);
    });

  });
};

var onDataDownloaded = function (data, tabletop) {
  var cleanData = clean(data);
  console.log('Found ' + cleanData.length + ' talks in spreadsheet…');
  //console.log(JSON.stringify(cleanData));
  writeHTML(genereateHtml(cleanData), TALKSHTML, TALKSID);
};


Tabletop({
  key: PROGRAM_SPREADSHEET_KEY,
  simpleSheet: true,
  callback: onDataDownloaded
});

