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
  this.auth.signInWithPopup(provider);
  window.location = '/dashboard';
}

Chubbo.prototype.signOut = function() {
  this.auth.signOut();
  window.location = '/';
}

Chubbo.prototype.onAuthStateChanged = function(user) {
  if (user) {}
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
