var navbar = Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4">
          <p v-on:click='handleLogin' class="cc-loginBtn">login</p>
          <p v-on:click='handleLogout' class="cc-logoutBtn">logout</p>
        </div>
      </div>
    </div>
  `,
  methods: {
    handleLogin: function() {
      window.login.signIn().then(function() {
        router.go('/dashboard');
        window.login.toggleLoginBtn(true);
      });
    },
    handleLogout: function() {
      window.login.signOut().then(function() {
        router.go('/')
      });
    }
  }
});
