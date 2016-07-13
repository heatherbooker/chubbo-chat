var dashboard = Vue.extend({
  created: function() {
    if (store.state.onMobile) {
      this.showMenuIcon();
    }
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
