var dashboard = Vue.extend({
  route: {
    //make sure user is logged in
    activate: function(transition) {
      var authStateChecked = false;
      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          //dashboard is for logged in users only! go to landing page
          transition.redirect('/');
        } else {
          //without this check, transition.next() is called multiple times
          if (!authStateChecked) {
            //ok, you can continue to view dashboard
            transition.next();
            authStateChecked = true;
          }
        }
      });
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
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    actions: {
      hideMenuMobile: function() {store.dispatch('toggleLeftPanel', false, 'isLeftPanelVisible');}
    }
  }
});
