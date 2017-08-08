/*jshint browser:true*/
/*globals console,Firebase,FirebaseSimpleLogin*/

var userId;
var _authHandlers = [];

var firebaseUrl = 'https://blinding-inferno-697.firebaseio.com/rating';

var firebaseStore = new Firebase(firebaseUrl);

var firebaseAuth = new FirebaseSimpleLogin(firebaseStore, (error, user) => {
  if (error) {
    console.log('Firebase error', error);
  } else if (user) {
    console.log('Got user object', user);
    userId = user.id;
    _authHandlers.forEach((cb) => cb(userId));
  } else {
    console.log('Creating user object');
    firebaseAuth.login('anonymous', { rememberMe: true });
  }
});

var onLoginStateChanged = (callback) => {
  _authHandlers.push(callback);
};

window.fire = firebaseStore;

export { firebaseStore, onLoginStateChanged };
