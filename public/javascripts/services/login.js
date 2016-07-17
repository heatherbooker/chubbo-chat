//Login co-ordinator constructor
window.ChubboChat.services.Login = function (onAuthStateChangeCallback) {
  this.auth = firebase.auth();
  //when authorization state changes, call callback
  this.auth.onAuthStateChanged(function(user) {
    onAuthStateChangeCallback(user);
  });
}

window.ChubboChat.services.Login.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  return this.auth.signInWithPopup(provider);
}

window.ChubboChat.services.Login.prototype.signOut = function() {
  return this.auth.signOut();
}

