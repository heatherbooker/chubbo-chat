var Main = Vue.extend({
  created: function() {
    //start instance of app to connect to firebase
    var me = this;
    //pass callback to login constructor to update when authorization state changes
    window.login = new Login(function(user) {me.updateUser(user);});
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <router-view></router-view>
    </div>
  `,
  components: {
    'nav-bar': navbar
  },
  //vuex state store
  store,
  //vuex action dispatcher(s) needed by this component
  vuex: {
    actions: {
      updateUser: function(state, user) {store.dispatch('setUser', user);}
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
});

router.start(Main, '#chubbo-chat');
