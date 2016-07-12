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
      showLeftPanel
    },
    mutations: {
      toggleLeftPanel: function(state) {
        alert('should show left panel meow');
        state.showLeftPanel = true;
      }
    }
  };
}

var store = new Vuex.Store(makeStore());
