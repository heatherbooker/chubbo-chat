var Main = Vue.extend({
  created: function() {
    //start instance of app to connect to firebase
    window.login = new Login();
    console.log('after creating new login', firebase.auth().currentUser);
    store.dispatch('updateUser');
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <router-view></router-view>
    </div>
  `,
  store
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
