function makeStore() {
  var onMobile = false,
      seeMenuIcon = false,
      seeLeftPanel = true;
  if ($(window).width() <= 400) {
    onMobile = true;
    seeLeftPanel = false;
  }
  return {
    state: {
      onMobile,
      seeMenuIcon,
      seeLeftPanel
    },
    mutations: {
      toggleState: function(state, newState, property) {
        state[property] = newState;
      }
    }
  };
}

var store = new Vuex.Store(makeStore());
