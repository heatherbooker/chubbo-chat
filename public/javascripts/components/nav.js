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
              v-link="{path: '/'}"
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
      //dashboard: show menu icon or logout btn (based on css media queries)
      //landing: show dashboard shortcut or login btn (based on user login status)
      if (this.$route.path === '/dashboard') {
        return true;
      }
    }
  },
  methods: {
    handleLogin: function() {
      window.login.signIn();
      var me = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          me.$router.go('/dashboard');
        }
      })
    },
    handleLogout: function() {
      window.login.signOut();
    },
    handleMenu: function() {
      //show or hide menu on menu icon click
      if (this.menuStatus === 'cc-leftPanel-mobile-hide') {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    }
  },
  //vuex(state store) getter(s) and action dispatchers needed by this component
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
