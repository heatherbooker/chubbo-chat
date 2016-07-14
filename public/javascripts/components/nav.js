var navbar = Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4">
          <div v-show="onDashboard">
            <img
              v-on:click='handleMenu'
              src="/images/hamburger.svg"
              class="cc-menuIcon-mobile"
            />
            <p
              v-on:click='handleLogout'
              class="cc-logoutBtn"
            >
              logout
            </p>
          </div>
          <div v-else>
            <p
              //only real users have uid
              v-show="!user.uid"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-link="{path: '/dashboard'}"
              class="cc-dashboardShortcut"
            >
              dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  computed: {
    onDashboard: function() {
      if (this.$route.path === '/dashboard') {
        //menu icon will be toggled with logout btn based on css media queries
        return true;
      }
    }
  },
  methods: {
    handleLogin: function() {
      var me = this;
      window.login.signIn().then(function() {
        me.$router.go('/dashboard');
      });
    },
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/');
      });
    },
    handleMenu: function() {
      if (this.menuStatus === 'cc-leftPanel-mobile-hide') {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    }
  },
  //get state and change state of vuex state store
  vuex: {
    getters: {
      menuStatus: function(state) {return state.leftPanelClass;},
      user: function(state) {return state.userInfo;}
    },
    actions: {
      showMenu: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-show', 'leftPanelClass');},
      hideMenu: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-hide', 'leftPanelClass');}
    }
  }
});
