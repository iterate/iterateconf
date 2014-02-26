/*jshint browser:true*/

var onUpdateReady = () => {
  if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
    // Browser downloaded a new app cache.
    // Swap it in and reload the page to get the new hotness.
    window.applicationCache.swapCache();
    window.location.reload();
  }
};

var bindToAppCacheEvent = (event, callback) => {
  if (window.applicationCache) {
    window.applicationCache.addEventListener(event, callback, false);
  }
};

window.addEventListener('load', (e) => {
  bindToAppCacheEvent('updateready', onUpdateReady);
}, false);
