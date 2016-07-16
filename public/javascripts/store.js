//vuex state store to share state between all components
window.ChubboChat.store = new Vuex.Store(function() {
  var userInfoDefault = {
    email: '',
    imgSrc: 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
  };
  return {
    state: {
      isLeftPanelVisible: true,
      userInfo: userInfoDefault
    },
    mutations: {
      toggleLeftPanel: function(state, newState) {
        state.isLeftPanelVisible = newState;
      },
      setUser: function(state, user) {
        if (user) {
          if (!user.photoURL) {
            user.imgSrc = 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
          } else {
            user.imgSrc = user.photoURL;
          }
          state.userInfo = user;
        } else {
          state.userInfo = userInfoDefault;
        }
      }
    }
  };
}());
