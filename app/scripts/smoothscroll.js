/*jshint browser:true*/
/*global define,self*/
// http://www.itnewb.com/tutorial/
//  Creating-the-Smooth-Scroll-Effect-with-JavaScript
// Include the height of the pre-header element
var offsetAbove = 50;

var getCurrentYPos = function () {
  return self.pageYOffset;
};

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

var uiCache = {
  main: document.getElementById('main-content')
};

var smoothScroll = function (eID) {
  var i;
  var startY = getCurrentYPos();
  var stopY = getYPosOfEl(eID);
  stopY -= offsetAbove;

  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 90);
  if (speed >= 20) {
    speed = 20;
  }
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (i = startY; i < stopY; i += step) {
      setTimeout(function () {
        uiCache.main.scrollTop = leapY;
      }, timer * speed);
      leapY += step;
      if (leapY > stopY) {
        leapY = stopY;
        timer++;
      }
    }
    return;
  }
  for (i = startY; i > stopY; i -= step) {
    setTimeout(function () {
      uiCache.main.scrollTop = leapY;
    }, timer * speed);
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
