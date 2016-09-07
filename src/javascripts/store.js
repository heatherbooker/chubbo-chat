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

      ADD_QUESTION: function(state, questionType) {
        var questionToAdd = {type: questionType, text: ''};
        if (questionType === 'options') {
          questionToAdd.options = [];
        }
        var questionIndex = state.selectedSurvey.questions.length;
        state.surveys.forEach(survey => {
          if (survey.id === state.selectedSurvey.id) {
            survey.questions.push(questionToAdd);
            survey.currentQuestionIndex = questionIndex;
          }
        });
        state.selectedSurvey.questions.push(questionToAdd);
        state.selectedSurvey.currentQuestionIndex = questionIndex;
      },

      EDIT_QUESTION: function(state, property, value) {
        console.log('in store:', property);
        var currentIndex = state.selectedSurvey.currentQuestionIndex;
        // state.surveys.forEach((survey) => {
        //   if (survey.id === state.selectedSurvey.id) {
        //     if (property === 'options' && value === '') {
        //       survey.questions[currentIndex].options.push('');
        //     } else {
        //       survey.questions[currentIndex][property] = value;
        //     }
        //   }
        // });
        if (property === 'options' && value === '') {
          console.log('about to push option, survey state:',
            JSON.stringify(state.selectedSurvey.questions[currentIndex]));
          state.selectedSurvey.questions[currentIndex].options.push('');
        } else {
          state.selectedSurvey.questions[currentIndex][property] = value;
        }
      },

      EDIT_TITLE:  function(state, title) {
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey.title = title;
          }
        });
        state.selectedSurvey.title = title;
      },

      SET_CURRENT_QUESTION_INDEX: function(state, index) {
        state.surveys.forEach((survey) => {
          if (survey.id === state.selectedSurvey.id) {
            survey.currentQuestionIndex = index;
          }
        });
        state.selectedSurvey.currentQuestionIndex = index;
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

      SET_SELECTED_SURVEY: function(state, survey = defaults.survey) {
        state.selectedSurvey = $.extend(true, {}, survey);
      },

      SET_TITLE_ERROR: function(state, hasError) {
        state.titleError = hasError;
      }

    }

  };
}());
