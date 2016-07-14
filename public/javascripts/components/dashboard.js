var dashboard = Vue.extend({
  created: function() {
    this.showMenuIcon();
    this.hideMenuMobile();
  },
  ready: function() {
    var me = this;
    var checkLoggedIn = function() {
      if (!firebase.auth().currentUser) {
        me.$router.go('/');
      }
    }
    window.setTimeout(checkLoggedIn, 1500);
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
  vuex: {
    actions: {
      showMenuIcon: function() {store.dispatch('toggleState', true, 'seeMenuIcon')},
      hideMenuMobile: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-hide', 'leftPanelClass');}
    }
  }
});
