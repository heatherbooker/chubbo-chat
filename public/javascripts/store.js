function makeStore() {
  var onMobile = false,
      seeMenuIcon = false,
      seeLeftPanel = true,
      userInfoDefault = {
        email: '',
        imgSrc: 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
      },
      userInfo = userInfoDefault;
  if ($(window).width() <= 400) {
    onMobile = true;
    seeLeftPanel = false;
  }
  if (firebase.auth().currentUser) {
    var user = firebase.auth().currentUser;
    user.imgSrc = user.photoURL || 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    userInfo = user;
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
