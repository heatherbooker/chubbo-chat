function Login() {
  this.auth = firebase.auth();
}

Login.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  //return promise to caller (navbar 'login' button)
  return this.auth.signInWithPopup(provider).then(function(result) {
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
console.log('1before making new login in login.js', firebase.auth().currentUser);
window.login = new Login;
console.log('2after making new login in login.js', firebase.auth().currentUser);
