//vuex state store to share state between all components
window.ChubboChat.store = new Vuex.Store(function() {
  var userInfoDefault = {
    email: '',
    imgSrc: 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
  };
  return {
    state: {
      isLeftPanelVisible: true,
      userInfo: userInfoDefault,
      surveys: [],
      drafts: []
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
      },
      startDraft: function(state) {
        state.drafts.push({questions: []});
      },
      editQuestion: function(state, index, question) {
        state.drafts[0].questions[index] = question;
      },
      editTitle:  function(state, title) {
        state.drafts[0].title = title;
      },
      publishSurvey: function(state, title, questions) {
        state.surveys.push({
          title,
          questions
        });
        state.drafts.splice(0, 1);
        var me = state;
        var settings = {
          url: 'https://chubbo-chat.firebaseio.com/surveys.json',
          method: 'POST',
          data: `{
            "user": "`+ me.userInfo.displayName +`",
            "surveyTitle": "`+ title +`",
            "questions": "`+ questions +`"
          }`
        }
        $.ajax(settings).done(function (response) {
          sweetAlert({
            title: 'Survey successfully published!',
            type: 'success'
          });
        });
      }
    }
  };
}());
