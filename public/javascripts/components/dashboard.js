var dashboard = Vue.extend({
  created: function() {
    if (store.state.onMobile) {
      this.showMenuIcon();
    }
  },
  ready: function() {
    var me = this;
    var checkLoggedIn = function() {
      if (!firebase.auth().currentUser) {
        alert('Sorry, it appears you are not logged in!');
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
      showMenuIcon: function() {store.dispatch('toggleState', true, 'seeMenuIcon')}
    }
  }
});
