var leftPanel = Vue.extend({
  template: `
  <div class="col-md-3 col-xs-10">
    <div class={{leftPanelClass}}>
      <img v-bind:src=userPic class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ email }} </p>
      <p v-on:click="handleLogout" class="cc-logout-leftPanel"> logout </p>
    </div>
  </div>
  `,
  methods: {
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/');
      });
    }
  },
  //vuex(state store) getter(s) needed by this component
  vuex: {
    getters: {
      leftPanelClass: function(state) {return state.leftPanelClass;},
      email: function(state) {return state.userInfo.email;},
      userPic: function(state) {return state.userInfo.imgSrc}
    }
  }
});
