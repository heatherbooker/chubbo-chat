var Main = Vue.extend({
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
