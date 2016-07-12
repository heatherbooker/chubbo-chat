var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3 col-xs-10">
    <div v-show=leftPanelStatus class="cc-leftPanel">
      <img v-bind:src=imgSrc class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ userInfo.email }} </p>
      <p v-show="onMobile" class="cc-logout-leftPanel"> logout </p>
    </div>
  </div>
  `,
  data: function() {
    //default user icon
    var imgSrc = 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    if (store.state.userInfo.photoURL) {
      imgSrc = store.state.userInfo.photoURL;
    }
    return {
      imgSrc,
      onMobile: store.state.onMobile
    };
  },
  vuex: {
    getters: {
      leftPanelStatus: function(state) {return state.showLeftPanel;},
      userInfo: function(state) {return state.userInfo;}
    }
  }
});
