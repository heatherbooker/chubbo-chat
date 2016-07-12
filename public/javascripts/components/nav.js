var navbar = Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4">
          <img
            v-show="showMenuIcon"
            v-on:click='showMenu'
            src="/images/hamburger.svg"
            class="cc-menuIcon" />
          <div v-else>
            <p
              v-show="!loginStatus"
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
    var showMenuIcon = false;
    if (store.state.onMobile) {
      if (this.$route.path === '/dashboard') {
        showMenuIcon = true;
      }
    }
    return {
      showMenuIcon,
      //loginStatus will be null or an object
      loginStatus: store.state.userInfo
    };
  },
  methods: {
    handleLogin: function() {
      var me = this;
      window.login.signIn().then(function() {
        me.$router.go('/dashboard');
        $('.cc-loginBtn').hide();
        $('.cc-logoutBtn').show();
        if ($(window).width() <= 1500) {
          me.showMenuIcon = true;
        }
      });
    },
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/')
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
        if ($(window).width() <= 1500) {
          me.showMenuIcon = false;
        }
      });
    }
  },
  vuex: {
    actions: {
      showMenu: function() {store.dispatch('toggleLeftPanel')}
    }
  }
});

Vue.component('nav-bar', navbar);
