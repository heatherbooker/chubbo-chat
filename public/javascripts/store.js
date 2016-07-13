function makeStore() {
  var onMobile = false,
      seeMenuIcon = false,
      seeLeftPanel = true,
      userInfo = null;
  if ($(window).width() <= 400) {
    onMobile = true;
    seeLeftPanel = false;
  }
  if (firebase.auth().currentUser) {
    userInfo = firebase.auth().currentUser;
  }
  return {
    state: {
      onMobile,
      seeMenuIcon,
      seeLeftPanel,
      userInfo
    },
    mutations: {
      toggleState: function(state, newState, property) {
        state[property] = newState;
      },
      setUser: function(state, user) {
        if (user) {
          state.userInfo = user;
        }
      }
    }
  };
}

var store = new Vuex.Store(makeStore());
