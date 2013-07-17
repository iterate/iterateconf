/*global define*/
define([], function () {
  'use strict';

  var roughTimeslots = [
    { str: '09:00 - 09:30', id: 0 },
    { str: '09:30 - 10:00', id: 1 },
    { str: '10:00 - 11:00', id: 2 },
    { str: '11:00 - 11:30', id: 7 },
    { str: '11:30 - 12:00', id: 8 },
    { str: '13:00 - 13:30', id: 9 },
    { str: '13:30 - 14:00', id: 10 },
    { str: '14:00 - 14:30', id: 11 },
    { str: '14:30 - 15:00', id: 12 },
    { str: '15:15 - 16:15', id: 13 },
    { str: '16:30 - 17:00', id: 19 }
  ];

  return {
    roughTimeslots: roughTimeslots
  };
});
