/*jshint node:true*/
var fs = require('fs');
var Tabletop = require('tabletop');

var PROGRAM_SPREADSHEET_KEY = '0AruGzswpcVkadGhYVmpCb3lhWE1qUW5fWG1EZWdYOEE';
var TALKSFILE = 'app/scripts/data/talks.js';

var clean = function (data) {
  var cleanData = [];
  data.forEach(function (talk) {
    var t = talk;
    t.beskrivelse = t.beskrivelsepm + t.beskrivelsedev;
    t.beskrivelse = t.beskrivelse.replace('\n', '<br/>');
    t.workshop = (t.workshop === "1"
      ? true
      : false);
    delete t.beskrivelsedev;
    delete t.beskrivelsepm;
    cleanData.push(t);
  });
  return cleanData;
};

var writeAMDJSON = function (data, filename) {
  var output = '';
  output += 'define([], function () {\n  return ';
  output += JSON.stringify(data, null, 2);
  output += ';\n});';
  fs.writeFile(filename, output, function (err) {
    if (err) {
      throw err;
    }
    console.log(data.length + ' items saved to ' + filename);
  });
};

var onDataDownloaded = function (data, tabletop) {
  var cleanData = clean(data);
  writeAMDJSON(cleanData, TALKSFILE);
};


Tabletop({
  key: PROGRAM_SPREADSHEET_KEY,
  simpleSheet: true,
  callback: onDataDownloaded
});

