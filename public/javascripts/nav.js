var navbar = Vue.extend({
  props: ['logo', 'loginBtn', 'logoutBtn'],
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8"><a href="/">
            <h1 class="cc-logo">{{ logo }}</h1></a></div>
        <div class="col-xs-4">
          <p class="cc-loginBtn">{{ loginBtn }}</p>
          <p class="cc-logoutBtn">{{ logoutBtn }}</p>
        </div>
      </div>
    </div>
  `
});

Vue.component('nav-bar', navbar);
