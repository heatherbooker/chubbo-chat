import surveyApi from './surveyApi.js';


export default (function() {

  var SURVEY_URL_ROOT = 'https://chubbo-chat.herokuapp.com/#!/surveys/';

  function publish(user, title, questions, timestamp) {
    var promise = new Promise((resolve, reject) => {
      if (user) {
        var finalQuestions = addQuotes(removeBlankQuestions(questions));
        addSurveyToDatabase(title, finalQuestions, timestamp)
            .then((surveyId) => {
              if (surveyId) {
                resolve(surveyId);
              }
            });
      }
    });
    return promise;
  }
  function addSurveyToDatabase(title, finalQuestions, timestamp) {
    return surveyApi.publishSurvey(`{
      "title": "${title}",
      "questions": [${finalQuestions}],
      "timestamp": ${timestamp}
    }`)
        .then((response) => {
          if (response.surveyId) {
            return response.surveyId;
          } else {
            console.log('error: ', response.errorMsg);
            return false;
          }
        });
  }
  function addQuotes(questions) {
    // Adding quotes to make it valid json for sending to database
    return questions.map(function(question) {
      return `"${question}"`;
    });
  }
  function removeBlankQuestions(questions) {
    var filteredQuestions = questions;
    // unless there's only one question,
    if (questions.length > 1) {
      // remove blank questions
      filteredQuestions = questions.filter(function(question) {
        return question !== '';
      });
    }
    return filteredQuestions;
  }

  return {
    handlePublishing: function(user, title, questions) {
      var promise = new Promise((resolve, reject) => {
        var timestamp = Date.now();
        publish(user, title, questions, timestamp)
            .then((surveyId) => {
              var surveyUrl = SURVEY_URL_ROOT + user.uid + '/' + surveyId;
              resolve({id: surveyId, timestamp, url: surveyUrl});
            });
      });
      return promise;
    },
    setLocalSurvey: function(title, questions, isForPublishing) {
      // isForPublishing will be true if user clicked 'Publish' button;
      // else, they just logged in while in the middle of creating a survey.
      var surveyObject = {
        id: '$creating_survey',
        isPublished: false,
        title,
        questions,
        isForPublishing
      };
      window.sessionStorage.setItem('cc-userSurvey', JSON.stringify(surveyObject));
    },
    removeBlankQuestions
  };
})();
