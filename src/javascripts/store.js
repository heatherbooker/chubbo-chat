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
      currentQuestionIndex: -1,
      isPublished: false
    }
  };

  return {

    state: {

      titleError: false,
      user: undefined,
      surveys: [],
      selectedSurvey: $.extend(true, {}, defaults.survey)
      
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
          if (!newSurvey.currentQuestionIndex) {
            newSurvey.currentQuestionIndex = 0;
          }
          state.surveys.push(newSurvey);
        }
      },

      DELETE_SURVEY: function(state, surveyId) {
        state.surveys.forEach((survey, index) => {
          if (survey.id === surveyId) {
            state.surveys.splice(index, 1);
          }
        });
      },

      ADD_QUESTION: function(state, questionType) {
        var questionToAdd = {type: questionType, text: ''};
        if (questionType === 'options') {
          questionToAdd.options = [];
        } else if (questionType === 'slider') {
          questionToAdd.left = '';
          questionToAdd.right = '';
        }
        var questionIndex = state.selectedSurvey.questions.length;
        state.selectedSurvey.questions.push(questionToAdd);
        state.selectedSurvey.currentQuestionIndex = questionIndex;
      },

      EDIT_QUESTION: function(state, property, value) {
        var currentIndex = state.selectedSurvey.currentQuestionIndex;
        state.selectedSurvey.questions[currentIndex][property] = value;
      },

      DELETE_QUESTION: function(state, index) {
        state.selectedSurvey.questions.splice(index, 1);
      },

      EDIT_TITLE:  function(state, title) {
        state.selectedSurvey.title = title;
      },

      SET_CURRENT_QUESTION_INDEX: function(state, index) {
        state.selectedSurvey.currentQuestionIndex = index;
      },

      PUBLISH_SURVEY: function(state, surveyId, timestamp) {
        state.surveys.forEach((survey) => {
          if (survey.id === defaults.survey.id) {
            survey.title = state.selectedSurvey.title;
            survey.isPublished = true;
            survey.id = surveyId;
            survey.timestamp = timestamp;
            survey.questions = surveyService.removeBlankQuestions(state.selectedSurvey.questions);
            delete survey.isForPublishing;
          }
        });
        state.titleError = false;
      },

      SET_SELECTED_SURVEY: function(state, survey = defaults.survey) {
        // Updates previously selected survey in survey list, before changing it.
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey = state.selectedSurvey;
          }
        });
        state.selectedSurvey = $.extend(true, {}, survey);
      },

      SET_TITLE_ERROR: function(state, hasError) {
        state.titleError = hasError;
      }

    }

  };
}());
