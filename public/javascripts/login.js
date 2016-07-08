$(document).ready(function() {

  //start instance of app to connect to firebase
  window.chubbo = new Chubbo();

});


function Chubbo() {

  $('.cc-loginBtn').click(this.signIn.bind(this));
  $('.cc-logoutBtn').click(this.signOut.bind(this));

  this.initFirebase();
}

Chubbo.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

Chubbo.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    window.location = '/dashboard';
    console.log(user.displayName);
  }).catch(function(error) {
    console.log('error logging in:', error.code);
  });
}

Chubbo.prototype.signOut = function() {
  this.auth.signOut().then(function() {
    window.location = '/';    
  }).catch(function(error) {
    console.log('error logging out:', error.code);
  });
}

Chubbo.prototype.onAuthStateChanged = function(user) {
  if (user) {
    toggleLoginBtn(true);
  } else {
    toggleLoginBtn(false);
  }
}


function toggleLoginBtn(isLoggedIn) {
  if (isLoggedIn) {
    $('.cc-loginBtn').hide();
    $('.cc-logoutBtn').show();
  } else {
    $('.cc-logoutBtn').hide();
    $('.cc-loginBtn').show();
  }
}
