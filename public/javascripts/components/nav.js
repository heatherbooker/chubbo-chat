var navbar = Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" v-on:click='goHome' class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4">
          <img
            v-show="menuIconStatus"
            v-on:click='handleMenu'
            src="/images/hamburger.svg"
            class="cc-menuIcon" />
          <div v-else>
            <p
              v-show="!user"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-on:click='handleLogout'
              class="cc-logoutBtn"
            >
              logout
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      user: firebase.auth().currentUser
    };
  },
  methods: {
    handleLogin: function() {
      var me = this;
      window.login.signIn().then(function() {
        me.$router.go('/dashboard');
        $('.cc-loginBtn').hide();
        $('.cc-logoutBtn').show();
      });
    },
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/')
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
      });
    },
    handleMenu: function() {
      if (!this.menuStatus) {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    },
    goHome: function() {
      this.hideMenuIcon();
    }
  },
  ready: function() {
    var me = this;
    window.setTimeout(function() {me.user = me.userInStore}, 1000);
  },
  vuex: {
    getters: {
      menuIconStatus: function(state) {return state.seeMenuIcon;},
      menuStatus: function(state) {return state.seeLeftPanel;},
      userInStore: function(state) {return state.userInfo;},
    },
    actions: {
      showMenu: function() {store.dispatch('toggleState', true, 'seeLeftPanel');},
      hideMenu: function() {store.dispatch('toggleState', false, 'seeLeftPanel');},
      showMenuIcon: function() {store.dispatch('toggleState', true, 'seeMenuIcon');},
      hideMenuIcon: function() {store.dispatch('toggleState', false, 'seeMenuIcon');}
    }
  }
});

Vue.component('nav-bar', navbar);
