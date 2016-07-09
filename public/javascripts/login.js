//start instance of app to connect to firebase
window.login = new Login();


function Login() {
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
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

Login.prototype.onAuthStateChanged = function(user) {
  if (user) {
    this.toggleLoginBtn(true);
  } else {
    this.toggleLoginBtn(false);
  }
}

Login.prototype.toggleLoginBtn = function(isLoggedIn) {
  if (isLoggedIn) {
    $('.cc-loginBtn').hide();
    $('.cc-logoutBtn').show();
  } else {
    $('.cc-logoutBtn').hide();
    $('.cc-loginBtn').show();
  }
}
