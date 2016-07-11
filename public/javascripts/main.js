var Main = Vue.extend({
  created: function() {
    //start instance of app to connect to firebase
    console.log('3before calling this.init', firebase.auth().currentUser);
    this.init();
    console.log('5after calling this.init', firebase.auth().currentUser)
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <router-view></router-view>
    </div>
  `,
  methods: {
    init: function(callback) {
      window.login = new Login();
      console.log('4after creating new login within this.init', firebase.auth().currentUser);
    }
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
