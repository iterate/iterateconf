/*jshint node:true*/
var fs = require('fs');

var cheerio = require('cheerio');
var Tabletop = require('tabletop');

var program = require('./program');

var RED = '\033[31m';
var GREEN = '\x1B[32m';
var RESET = '\033[0m';

var PROGRAM_SPREADSHEET_KEY = '0ApxuzZeYd8qddFFPSE1NZGtycUtEY2ZlSHJOa3NmSXc';
var TALKSHTML = 'app/index.html';
var TALKSID = '#talks';
var MINISCHEDULEID = '#mini-schedule';

var clean = function (data) {
  return data.map(function (talk) {
    talk.workshop = talk.workshop === '1' ? true : false;
    return talk;
  });
};

var _getTalk = function (talkId, talks) {
  var talk = talks[talkId];
  var user = talk.username.split('@')[0];
  talk.id = talkId;
  talk.beskrivelse = talk.beskrivelse.replace('\n', '<br>');
  talk.img = 'images/' + user + '.jpg';
  return talk;
};

var _getTalkTmpl = function(talk, single, saveAsPrev) {
  var centered = single ? ' small-centered' : '';
  var workshopEl = talk.workshop ?
    '<h4 class="workshop">Workshop</h4>' : '';
  var description = saveAsPrev ?
    '(Fortsetter fra forrige slot.)' : talk.beskrivelse;
  var rating = [
    '<span data-val="4">☆</span>',
    '<span data-val="3">☆</span>',
    '<span data-val="2">☆</span>',
    '<span data-val="1">☆</span>',
  ].join('');
  return [
    '<article id="talk-' + talk.id + '"',
    '         class="small-12 large-6' + centered + ' columns">',
    '  <figure class="profile text-col">',
    '    <div class="row">',
    '    <div class="medium-6 columns">',
    '      <img src="' + talk.img + '" />',
    '    </div>',
    '    <div class="small-12 medium-6 columns">',
    '      <h2>' + talk.tittel + '</h2>',
    '      <div class="rating" data-talkid=' + talk.id + '>',
    rating,
    '      </div>',
    '      <span class="byline">' + talk.username + '</span>',
    workshopEl,
    '    </div>',
    '    </div>',
    '  </figure>',
    '  <p class="article-text text-col">' + description + '</p>',
    '</article>'
  ];
};

var buildTalk = function (talkId, slotId, talks, sameAsPrev) {
  var timeslot = program.timeslots[slotId];
  var talk = _getTalk(talkId, talks);
  var tmpl = '<h4 class="timeslot text-center" id="slot-' + slotId + '">';
  tmpl += timeslot + '</h4>';
  return tmpl + _getTalkTmpl(talk, true, sameAsPrev).join('\n');
};

var buildParallell = function (talkId1, talkId2, slotId, data, sameAsPrev1,
                               sameAsPrev2) {
  var timeslot = program.timeslots[slotId];
  var buildParallellTalk = function (talk, sameAsPrev) {
    var tmpl = _getTalkTmpl(talk, false, sameAsPrev);
    return tmpl.join('\n');
  };

  return [
    '<h4 class="timeslot text-center parallell-indicator"',
    '    id="slot-' + slotId + '">' + timeslot + '</h4>',
    '<div class="row parallell-talks">',
    buildParallellTalk(_getTalk(talkId1, data), sameAsPrev1),
    buildParallellTalk(_getTalk(talkId2, data), sameAsPrev2),
    '</div>'
  ].join('\n');
};

var addBreak = function (slotId) {
  var timeslot = program.timeslots[slotId];
  return [
    '<section class="talk">',
    '  <h4 class="timeslot text-center" id="slot-' + slotId + '">',
    timeslot,
    '  </h4>',
    '  <div class="row">',
    '    <article class="large-12 columns">',
    '      <h2 class="text-center">Pause</h2>',
    '    </article>',
    '  </div>',
    '</section>'
  ].join('\n');
};

var addTalk = function (talkTempl) {
  var el = '<section class="talk">\n';
  el += talkTempl;
  el += '\n</section>';
  return el;
};


var generateMiniSchedule = function (data) {
  var html = '\n';
  program.talksOrder.forEach(function (talksInSlot, i) {
    var startTime = program.timeslots[i].split(' - ')[0];

    html += '<div class="row mini-schedule-row">\n';

    html += '<div class="small-3 columns text-center"><h4>';
    html += startTime;
    html += '</h4></div>\n';

    switch (talksInSlot.length) {
      case 0:
        html += '<a href="#slot-' + i + '">',
        html += '<div class="small-9 columns text-left"><p>';
        html += 'Pause';
        html += '</p></div></a>\n';
        break;
      case 1:
      case 2:
        var track1 = _getTalk(talksInSlot[0], data);
        html += '<a href="#talk-' + track1.id + '">',
        html += '<div class="small-9 columns text-left"><p>';
        html += track1.tittel;
        html += '</p></div></a>\n';
        break;
    }

    html += '</div>\n';
  });
  html += '\n';
  return html;
};
var generateMainSchedule = function (data) {
  var html = '';
  var numberOfTalks = 0;
  program.talksOrder.forEach(function (talksInSlot, i) {
    var sameAsPrev1, sameAsPrev2;
    if (i > 0) {
      sameAsPrev1 = talksInSlot[0] === program.talksOrder[i - 1][0];
      sameAsPrev2 = talksInSlot[1] === program.talksOrder[i - 1][1];
    }
    html += '\n';
    switch (talksInSlot.length) {
      case 0:
        html += addBreak(i);
        break;
      case 1:
        html += addTalk(buildTalk(talksInSlot[0], i, data, sameAsPrev1));
        numberOfTalks += 1;
        break;
      case 2:
        html += addTalk(buildParallell(talksInSlot[0],
                                       talksInSlot[1],
                                       i,
                                       data,
                                       sameAsPrev1,
                                       sameAsPrev2));
        numberOfTalks += 2;
        break;
    }
  });
  html += '\n';

  console.log('Found ' + numberOfTalks + ' talks in schedule…');
  return html;
};

var writeHTML = function (filename, injects) {
  var html = fs.readFile(filename, function (err, data) {
    if (err) { throw err; }
    var $ = cheerio.load(data);
    injects.forEach(function (injectObj) {
      $(injectObj.id).html(injectObj.html);
    });
    fs.writeFile(filename, $.html(), function (err) {
      if (err) { throw err; }
      console.log(GREEN + 'Talks successfully injected → ' +
                  filename + RESET);
    });

  });
};

var onDataDownloaded = function (data, tabletop) {
  var cleanData = clean(data);
  console.log('Found ' + cleanData.length + ' talks in spreadsheet…');
  writeHTML(TALKSHTML, [
    { html: generateMainSchedule(cleanData), id: TALKSID },
    { html: generateMiniSchedule(cleanData), id: MINISCHEDULEID }
  ]);
};


Tabletop({
  key: PROGRAM_SPREADSHEET_KEY,
  simpleSheet: true,
  callback: onDataDownloaded
});

