function Chubbo() {

  $('.cc-loginBtn').click(this.signIn.bind(this));
  $('.cc-logoutBtn').click(this.signOut.bind(this));

  this.initFirebase();
}

Chubbo.prototype.initFirebase = function() {
  this.auth = firebase.auth();
  //initiate firebase auth and listen
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

Chubbo.prototype.signIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
}

Chubbo.prototype.signOut = function() {
  this.auth.signOut();
}

Chubbo.prototype.onAuthStateChanged = function(user) {
  if (user) {
    console.log(user.displayName);
    $('.cc-loginBtn').hide();
    $('.cc-logoutBtn').show();
  } else {
    $('.cc-logoutBtn').hide();
    $('.cc-loginBtn').show();
  }
}

   
//controlling modal
$(document).ready(function() {

  //start instance of app to connect to firebase
  window.chubbo = new Chubbo();


});

