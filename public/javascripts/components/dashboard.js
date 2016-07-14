var dashboard = Vue.extend({
  created: function() {
    this.hideMenuMobile();
  },
  ready: function() {
    var me = this;
    var checkLoggedIn = function() {
      //kick user out of dashboard if not logged in
      if (!firebase.auth().currentUser) {
        me.$router.go('/');
      }
    }
    //firebase user isn't updated immediately, so check after it has updated
    window.setTimeout(checkLoggedIn, 800);
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
