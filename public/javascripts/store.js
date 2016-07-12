function makeStore() {
  var onMobile = false,
      showLeftPanel = true;
  if ($(window).width() <= 1500) {
    onMobile = true;
    showLeftPanel = false;
  }
  return {
    state: {
      onMobile,
      showLeftPanel,
      userInfo: firebase.auth().currentUser
    },
    mutations: {
      toggleLeftPanel: function(state) {
        alert('should show left panel meow');
        state.showLeftPanel = true;
      },
      updateUser: function(state) {
        state.userInfo = firebase.auth().currentUser;
      }
    }
  };
}

var store = new Vuex.Store(makeStore());
