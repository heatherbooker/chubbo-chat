function Login() {
  this.auth = firebase.auth();
}

Login.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  //return promise to caller (navbar 'login' button)
  return this.auth.signInWithPopup(provider).then(function(result) {
    console.log(result.user.displayName);
  }).catch(function(error) {
    console.log('error logging in:', error.code);
  });
}

Login.prototype.signOut = function() {
  //return promise to caller (navbar 'logout' button)
  return this.auth.signOut().then(function() {
  }).catch(function(error) {
    console.log('error logging out:', error.code);
  });
}
