var Main = Vue.extend({
  ready: function() {
    //start instance of app to connect to firebase
    window.login = new Login();
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <router-view></router-view>
    </div>
  `,
  components: {
    'nav-bar': navbar
  }
});

var router = new VueRouter();

router.map({
  '/': {
    component: landing
  },
  '/dashboard': {
    component: dashboard
  }
})

router.start(Main, '#chubbo-chat')
