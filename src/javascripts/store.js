//libraries
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


//vuex state store to share state between all components
export default new Vuex.Store(function() {

  var defaults = {
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
      user: undefined,
      surveys: [],
      selectedSurvey: $.extend(true, {}, defaults.survey),
      
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
        state.user = user;
      },

      deleteAllSurveys: function(state) {
        state.surveys = [];
        state.selectedSurvey = defaults.survey;
      },

      addSurvey: function(state, newSurvey = $.extend(true, {}, defaults.survey)) {
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

      publishSurvey: function(state, surveyId, timestamp) {
        state.surveys.forEach((survey) => {
          if (survey.id === defaults.survey.id) {
            survey.isPublished = true;
            survey.id = surveyId;
            survey.timestamp = timestamp;
            delete survey.isForPublishing;
          }
        });
      },

      setSelectedSurvey: function(state, survey = $.extend(true, {}, defaults.survey)) {
        state.selectedSurvey = survey;
      }

    }

  };
}());
