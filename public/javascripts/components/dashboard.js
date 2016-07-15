var dashboard = Vue.extend({
  route: {
    //make sure user is logged in
    activate: function(transition) {
      var checkLoggedIn = function() {
        if (!firebase.auth().currentUser) {
          alert('no dice on dashboard!');
          transition.redirect('/');
        } else {
          transition.next();
        }
      }
      //firebase user isn't updated immediately, so check after it has updated
      window.setTimeout(checkLoggedIn, 300);
    }
  },
  created: function() {
    this.hideMenuMobile();
  },
  template: `
    <div class="container-fluid">
      <div class="row">
        <left-panel></left-panel>
      </div>
    </div>
  `,
  components: {
    'left-panel': leftPanel
  },
  //vuex(state store) action dispatcher(s) needed by this component
  vuex: {
    actions: {
      hideMenuMobile: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-hide', 'leftPanelClass');}
    }
  }
});
