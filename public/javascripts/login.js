//Login co-ordinator constructor
function Login(onAuthStateChangeCallback) {
  this.auth = firebase.auth();
  //when authorization state changes, call callback
  this.auth.onAuthStateChanged(function(user) {
    onAuthStateChangeCallback(user);
  });
}

Login.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  return this.auth.signInWithPopup(provider);
}

Login.prototype.signOut = function() {
  return this.auth.signOut();
}
