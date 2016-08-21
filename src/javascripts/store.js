//libraries
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


//vuex state store to share state between all components
export default new Vuex.Store(function() {

  var defaults = {
    userInfo: {
      email: 'not signed in',
      imgSrc: 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
    },
    survey: {
      id: '$creating_survey',
      title: '',
      questions: [''],
      isPublished: false
    }
  };

  return {

    state: {

      isLeftPanelVisible: true,
      userInfo: defaults.userInfo,
      surveys: [],
      selectedSurvey: defaults.survey,
      
    },

    // The form of a survey should be as follows:
    // {
    //   id: '',
    //   title: '',
    //   questions: [''],
    //   responses: {}, // added when there is a response
    //   isForPublishing: true, // added if survey is saved locally before user is redirected to login
    //   isPublished: false,
    //   timestamp: 1 // added when survey is published
    // }


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
          state.userInfo = defaults.userInfo;
        }
      },

      DELETE_ALL_SURVEYS: function(state) {
        state.surveys = [];
        state.selectedSurvey = defaults.survey;
      },

      ADD_SURVEY: function(state, newSurvey = defaults.survey) {
        var isInStore = state.surveys.find((survey) => {
          return survey.id === newSurvey.id;
        });
        if (!isInStore) {
          state.surveys.push(newSurvey);
        }
      },

      editQuestion: function(state, index, question) {
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey.questions[index] = question;
          }
        });
        state.selectedSurvey.questions[index] = question;
      },

      editTitle:  function(state, title) {
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey.title = title;
          }
        });
        state.selectedSurvey.title = title;
      },

      PUBLISH_SURVEY: function(state, surveyId, timestamp) {
        state.surveys.forEach((survey) => {
          if (survey.id === defaults.survey.id) {
            survey.isPublished = true;
            survey.id = surveyId;
            survey.timestamp = timestamp;
          }
        });
      },

      setSelectedSurvey: function(state, survey = defaults.survey) {
        state.selectedSurvey = survey;
      }

    }

  };
}());
