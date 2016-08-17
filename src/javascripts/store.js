//libraries
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


//vuex state store to share state between all components
export default new Vuex.Store(function() {

  var userInfoDefault = {
    email: 'not signed in',
    imgSrc: 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
  };

  return {

    state: {

      isLeftPanelVisible: true,
      userInfo: userInfoDefault,
      surveys: [],
      drafts: [],
      isPublished: false
      
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
        if (state.drafts.length === 0) {
          state.drafts.push({questions: []})
        }
        state.drafts[0].questions[index] = question;
      },

      editTitle:  function(state, title) {
        if (state.drafts.length === 0) {
          state.drafts.push({questions: []})
        }
        state.drafts[0].title = title;
      },

      publishSurvey: function(state, title, questions) {
        state.surveys.push({
          title,
          questions
        });
        state.drafts.splice(0, 1);
      },

      setIsPublished: function(state, newState) {
        state.isPublished = newState;
      }

    }

  };
}());
