var dashboard = Vue.extend({
  route: {
    //make sure user is logged in
    activate: function(transition) {
      if (!firebase.auth().currentUser) {
        transition.redirect('/');
      } else {
        transition.next();
      }
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
      hideMenuMobile: function() {store.dispatch('toggleLeftPanel', false, 'isLeftPanelVisible');}
    }
  }
});
