var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3 col-xs-10">
    <div v-show=leftPanelStatus transition="slide" class="cc-leftPanel">
      <img v-bind:src=imgSrc class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ email }} </p>
      <p v-show="onMobile" v-on:click="handleLogout" class="cc-logout-leftPanel"> logout </p>
    </div>
  </div>
  `,
  data: function() {
    //default user icon
    var imgSrc = 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    if (this.userInfo.photoURL) {
      imgSrc = this.userInfo.photoURL;
    }
    return {
      imgSrc,
      onMobile: store.state.onMobile,
      email: this.userInfo.email
    };
  },
  methods: {
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/');
        me.hideMenuIcon();
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
        me.hideLeftPanel();
      });
    }
  },
  vuex: {
    actions: {
      hideLeftPanel: function() {store.dispatch('toggleState', false, 'seeLeftPanel');},
      hideMenuIcon: function() {store.dispatch('toggleState', false, 'seeMenuIcon');}
    },
    getters: {
      leftPanelStatus: function(state) {return state.seeLeftPanel;},
      userInfo: function(state) {return state.userInfo;}
    }
  }
});
