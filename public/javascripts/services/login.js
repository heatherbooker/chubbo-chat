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
  if (window.matchMedia("(max-width: 992px)").matches) {
    //on mobile
    this.auth.signInWithRedirect(provider);
  } else {
    this.auth.signInWithPopup(provider).then(function(result) {
      window.hResult = result;
    });    
  }
}

window.ChubboChat.services.Login.prototype.signOut = function() {
  this.auth.signOut();
}


