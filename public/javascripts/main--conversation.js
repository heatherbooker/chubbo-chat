window.ChubboChat.components.Main__Conversation = Vue.extend({
  template: `
    <div>
      <simple-nav-bar></simple-nav-bar>
      <router-view></router-view>
    </div>
  `,
  components: {
    'simple-nav-bar': window.ChubboChat.components.simpleNavBar
  },
  //vuex state store
  store: window.ChubboChat.store,
});

window.ChubboChat.services.router = new VueRouter();

window.ChubboChat.services.router.map({
  '/': {
    component: window.ChubboChat.components.conversation
  },
  '/:user/:title': {
    component: window.ChubboChat.components.conversation
  }
});

window.ChubboChat.services.router.start(window.ChubboChat.components.Main__Conversation, '#chubbo-chat--conversation');
