var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3 col-xs-10">
    <div v-show=leftPanelStatus class="cc-leftPanel">
      <img v-bind:src=imgSrc class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ userInfo.email }} </p>
      <p v-show="onMobile" v-on:click="handleLogout" class="cc-logout-leftPanel"> logout </p>
    </div>
  </div>
  `,
  data: function() {
    var userInfo = firebase.auth().currentUser;
    //default user icon
    var imgSrc = 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    if (userInfo.photoURL) {
      imgSrc = userInfo.photoURL;
    }
    return {
      userInfo,
      imgSrc,
      onMobile: store.state.onMobile
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
      leftPanelStatus: function(state) {return state.seeLeftPanel;}
    }
  }
});
