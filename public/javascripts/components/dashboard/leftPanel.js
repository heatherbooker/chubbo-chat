window.ChubboChat.components.leftPanel = Vue.extend({
  template: `
    <div v-bind:class="isLeftPanelVisible ? 'cc-leftPanel-mobile-show' : 'cc-leftPanel-mobile-hide'">
      <img v-bind:src=userPic class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ email }} </p>
      <p v-link="{path: '/'}" v-on:click="handleLogout" class="cc-logout-leftPanel"> logout </p>
    </div>
  `,
  data: function() {
    return {
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  methods: {
    handleLogout: function() {
      window.ChubboChat.services.login.signOut();
    }
  },
  //vuex(state store) getter(s) needed by this component
  vuex: {
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;},
      email: function(state) {return state.userInfo.email;},
      userPic: function(state) {return state.userInfo.imgSrc}
    }
  }
});
