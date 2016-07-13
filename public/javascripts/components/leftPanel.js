var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3 col-xs-10">
    <div v-show=leftPanelStatus transition="slide" class="cc-leftPanel">
      <img v-bind:src=userPic class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ email }} </p>
      <p v-show="onMobile" v-on:click="handleLogout" class="cc-logout-leftPanel"> logout </p>
    </div>
  </div>
  `,
  methods: {
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/');
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
        me.hideLeftPanel();
      });
    }
  },
  vuex: {
    actions: {
      hideLeftPanel: function() {store.dispatch('toggleState', false, 'seeLeftPanel');}
    },
    getters: {
      leftPanelStatus: function(state) {return state.seeLeftPanel;},
      email: function(state) {return state.userInfo.email;},
      userPic: function(state) {return state.userInfo.imgSrc},
      onMobile: function(state) {return state.onMobile;}
    }
  }
});
