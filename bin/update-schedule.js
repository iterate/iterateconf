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
      workshopWarning += '<div class="workshop">';
      workshopWarning += '<em>~ This is a workshop ~</em></div>';
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

var addBreak = function (slotId) {
  var timeslot = program.timeslots[slotId];
  return [
    '<section class="talk">',
    '  <div class="timeslot" id="slot-' + slotId + '">' + timeslot + '</div>',
    '  <div class="row">',
    '    <article class="large-12 columns">',
    '      <h2>Pause</h2>',
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

    html += '<a href="#slot-' + i + '">';
    html += '<div class="row mini-schedule-row">\n';

    html += '<div class="small-5 columns text-right"><p>';
    switch (talksInSlot.length) {
      case 0:
        html += 'Pause';
        html += '</p></div>\n';
        break;
      case 1:
      case 2:
        var track1 = _getTalk(talksInSlot[0], data);
        html += track1.tittel;
        html += '</p></div>\n';
        break;
    }

    html += '<div class="small-2 columns text-center"><h4>';
    html += startTime;
    html += '</h4></div>\n';

    html += '<div class="small-5 columns text-left"><p>';
    switch (talksInSlot.length) {
      case 0:
        html += 'Pause';
        break;
      case 2:
        var track2 = _getTalk(talksInSlot[1], data);
        html += track2.tittel;
        break;
    }
    html += '</p></div>\n';

    html += '</div></a>\n';
  });
  html += '\n';
  return html;
};
var generateMainSchedule = function (data) {
  var html = '';
  var numberOfTalks = 0;
  program.talksOrder.forEach(function (talksInSlot, i) {
    html += '\n';
    switch (talksInSlot.length) {
      case 0:
        html += addBreak(i);
        break;
      case 1:
        html += addTalk(buildTalk(talksInSlot[0], i, data));
        numberOfTalks += 1;
        break;
      case 2:
        html += addTalk(buildParallell(talksInSlot[0],
                                       talksInSlot[1],
                                       i,
                                       data));
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

