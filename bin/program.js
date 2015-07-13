/*jshint node:true*/
var timeslots = [
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:15',
  '10:15 - 10:25',
  '10:30 - 10:40',
  '10:45 - 10:55',
  '10:55 - 11:10',
  '11:10 - 11:20',
  '11:24 - 11:34',
  '11:37 - 11:47',
  '11:50 - 12:00',
  '12:00 - 13:00',
  '13:00 - 13:30',
  '13:30 - 14:00',
  '14:00 - 14:15',
  '14:15 - 14:45',
  '14:45 - 15:15',
  '15:15 - 15:30',
  '15:30 - 16:00',
  '16:00 - 16:30'
];

var talksOrder = [
  [33],
  [],
  [],
  [13, 10],
  [17, 25],
  [18, 32],
  [],
  [4, 11],
  [24, 12],
  [26, 3],
  [7, 27],
  [],
  [31, 0],
  [5, 30],
  [],
  [14, 19],
  [16, 28],
  [],
  [6, 2],
  []
];

exports.timeslots = timeslots;
exports.talksOrder = talksOrder;
