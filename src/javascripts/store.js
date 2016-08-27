//libraries
import Vue from 'vue'
import Vuex from 'vuex'
// Services
import surveyService from './services/surveyService.js';

Vue.use(Vuex);


//vuex state store to share state between all components
export default new Vuex.Store(function() {

  var defaults = {
    survey: {
      id: '$creating_survey',
      title: '',
      questions: [],
      isPublished: false
    }
  };

  return {

    state: {

      titleError: false,
      user: undefined,
      surveys: [],
      selectedSurvey: $.extend(true, {}, defaults.survey),
      
    },

    // The form of a survey should be as follows:
    // {
    //   id: '',
    //   title: '',
    //   questions: [],
    //   responses: {}, // added when there is a response
    //   isForPublishing: true, // added if survey is saved locally before user is redirected to login
    //   isPublished: false,
    //   timestamp: 1 // added when survey is published
    // }


    mutations: {

      SET_USER: function(state, user) {
        state.user = user;
      },

      DELETE_ALL_SURVEYS: function(state) {
        state.surveys = [];
        state.selectedSurvey = defaults.survey;
      },

      ADD_SURVEY: function(state, newSurvey = $.extend(true, {}, defaults.survey)) {
        var isInStore = state.surveys.find((survey) => {
          return survey.id === newSurvey.id;
        });
        if (!isInStore) {
          state.surveys.push(newSurvey);
        }
      },

      EDIT_QUESTION: function(state, index, question) {
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey.questions[index] = question;
          }
        });
        state.selectedSurvey.questions[index] = question;
      },

      EDIT_TITLE:  function(state, title) {
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
            survey.questions = surveyService.removeBlankQuestions(survey.questions);
            delete survey.isForPublishing;
          }
        });
        state.titleError = false;
      },

      SET_SELECTED_SURVEY: function(state, survey = $.extend(true, {}, defaults.survey)) {
        state.selectedSurvey = survey;
      },

      SET_TITLE_ERROR: function(state, hasError) {
        state.titleError = hasError;
      }

    }

  };
}());
