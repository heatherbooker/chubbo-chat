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
    if ($(window).width <= 400) {
      if (this.$route.path === '/dashboard') {
        showMenuIcon = true;
      }
    }
    console.log('running data function', firebase.auth().currentUser);
    return {
      showMenuIcon,
      loginStatus: firebase.auth().currentUser
    };
  },
  methods: {
    handleLogin: function() {
      var me = this;
      window.login.signIn().then(function() {
        router.go('/dashboard');
        $('.cc-loginBtn').hide();
        $('.cc-logoutBtn').show();
        if ($(window).width() <= 400) {
          me.showMenuIcon = true;
        }
      });
    },
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        router.go('/')
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
        if ($(window).width() <= 400) {
          me.showMenuIcon = false;
        }
      });
    },
    showMenu: function() {
      alert('hay a  menu');
      mobilePanel.showPanel = true;
    }
  }
});

Vue.component('nav-bar', navbar);
