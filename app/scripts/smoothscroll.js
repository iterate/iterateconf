/*jshint browser:true*/
// http://www.itnewb.com/tutorial/
//  Creating-the-Smooth-Scroll-Effect-with-JavaScript
// Include the height of the pre-header element
var offsetAbove = 50;

var getYPosOfEl = function (id) {
  var el = document.getElementById(id);
  var y = el.offsetTop;

  var node = el;
  while (node.offsetParent && node.offsetParent != document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
};

var smoothScroll = function (eID) {
  var i;
  var startY = getYPosOfEl('main-content');
  var stopY = getYPosOfEl(eID);
  stopY -= offsetAbove;

  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    document.getElementById('main-content').scrollTop = stopY;
    return;
  }
  var speed = Math.round(distance / 90);
  if (speed >= 40) {
    speed = 40;
  }
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (i = startY; i < stopY; i += step) {
      setTimeout('document.getElementById("main-content").scrollTop = '+leapY,
                 timer * speed);
      leapY += step;
      if (leapY > stopY) {
        leapY = stopY;
        timer++;
      }
    }
    return;
  }
  for (i = startY; i > stopY; i -= step) {
    setTimeout('document.getElementById("main-content").scrollTop = '+leapY,
               timer * speed);
    leapY -= step;
    if (leapY < stopY) {
      leapY = stopY;
    }
    timer++;
  }
};

var toHref = function (event) {
  event.preventDefault();
  var elId = event.target.hash.replace('#','');
  smoothScroll(elId);

  return false;
};

export { toHref };
