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

      ADD_QUESTION: function(state, questionType) {
        var questionToAdd;
        state.surveys.forEach(survey => {
          if (survey.id === state.selectedSurvey.id) {
            if (questionType === 'text') {
              questionToAdd = {text: '', type: questionType};
            } else {
              questionToAdd = {type: questionType};
            }
            survey.questions.push(questionToAdd);
          }
        });
        state.selectedSurvey.questions.push(questionToAdd);
      },

      EDIT_QUESTION: function(state, index, value, property = 'text') {
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey.questions[index][property] = value;
          }
        });
        state.selectedSurvey.questions[index][property] = value;
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
