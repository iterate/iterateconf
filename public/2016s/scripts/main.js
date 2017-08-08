/*jshint browser:true, devel:true */

import './menu';
import './rating';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(() => console.log('Service Worker Registered!'));
}
