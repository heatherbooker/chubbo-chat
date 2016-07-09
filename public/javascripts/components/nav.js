var navbar = Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4">
          <p v-show="loginStatus" v-on:click='handleLogin' class="cc-loginBtn">login</p>
          <p v-else v-on:click='handleLogout' class="cc-logoutBtn">logout</p>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {loginStatus: firebase.auth().currentUser};
  },
  methods: {
    handleLogin: function() {
      window.login.signIn().then(function() {
        router.go('/dashboard');
        $('.cc-loginBtn').hide();
        $('.cc-logoutBtn').show();
      });
    },
    handleLogout: function() {
      window.login.signOut().then(function() {
        router.go('/')
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
      });
    }
  }
});
