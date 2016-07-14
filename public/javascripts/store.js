//vuex state store to share state between all components
function makeStore() {
  var leftPanelClass = 'cc-leftPanel-mobile-hide',
      userInfoDefault = {
        email: '',
        imgSrc: 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
      },
      userInfo = userInfoDefault;
  if (firebase.auth().currentUser) {
    var user = firebase.auth().currentUser;
    user.imgSrc = user.photoURL || 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    userInfo = user;
  }
  return {
    state: {
      leftPanelClass,
      userInfo
    },
    mutations: {
      toggleState: function(state, newState, property) {
        state[property] = newState;
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
}

var store = new Vuex.Store(makeStore());
