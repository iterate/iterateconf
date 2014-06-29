/*jshint browser:true*/
/*global DocumentTouch*/

var hasTouch = ('ontouchstart' in window) ||
    window.DocumentTouch && document instanceof DocumentTouch;
var tapEvent = hasTouch ? 'touchstart' : 'click';

var onClick = (el, handler) => {
  el.addEventListener(tapEvent, handler, false);
};
var removeClick = (el, handler) => {
  el.removeEventListener(tapEvent, handler, false);
};

export { onClick, removeClick };
