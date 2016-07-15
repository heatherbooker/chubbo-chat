window.ChubboChat.components.Main = Vue.extend({
  created: function() {
    //start instance of app to connect to firebase
    var me = this;
    //pass callback to login constructor to update when authorization state changes
    window.ChubboChat.services.login = new window.ChubboChat.services.Login(function(user) {me.updateUser(user);});
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <router-view></router-view>
    </div>
  `,
  data: function() {
    return {
      //vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  components: {
    'nav-bar': window.ChubboChat.components.navbar
  },
  //vuex state store
  store: window.ChubboChat.store,
  //vuex action dispatcher(s) needed by this component
  vuex: {
    actions: {
      updateUser: function(state, user) {this.store.dispatch('setUser', user);}
    }
  }
});

window.ChubboChat.services.router = new VueRouter();

window.ChubboChat.services.router.map({
  '/': {
    component: window.ChubboChat.components.landing
  },
  '/dashboard': {
    component: window.ChubboChat.components.dashboard
  }
});

window.ChubboChat.services.router.start(window.ChubboChat.components.Main, '#chubbo-chat');
