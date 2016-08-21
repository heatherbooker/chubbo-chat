//Login co-ordinator constructor
var Login = function (onAuthStateChangeCallback) {
  this.auth = firebase.auth();
  //when authorization state changes, call callback
  this.auth.onAuthStateChanged(function(user) {
    onAuthStateChangeCallback(user);
  });
}

Login.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  return this.auth.signInWithRedirect(provider);
}

Login.prototype.signOut = function() {
  this.auth.signOut();
}

Login.prototype.getUserAfterRedirect = function() {
  return this.auth.getRedirectResult().then((result) => {
    return result.user;
  });
};

module.exports = Login;
