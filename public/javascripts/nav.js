var navbar = Vue.extend({
  data: function() {
    return {
      logo: "Chubbo-Chat",
      loginBtn: "login",
      logoutBtn:"logout"
    };
  },
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

new Vue({
  el: '#cc-nav',
  template: `<nav-bar>
             </nav-bar>`
})
