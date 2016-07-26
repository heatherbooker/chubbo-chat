window.ChubboChat.services.surveyApi = {

  publishSurvey: function(survey) {
    //returns promise with authentication token
    var tokenPromise = firebase.auth().currentUser.getToken();

    //return fetch promise to caller 
    return tokenPromise.then(function(authToken) {
      return fetch('https://chubbo-chat.firebaseio.com/surveys.json?auth=' + authToken, {
        method: 'post',
        body: survey
      });
    });
  },

  getSurvey: function() {
    var tokenPromise = firebase.auth().currentUser.getToken();

    return tokenPromise.then(function(authToken) {
      return fetch('https://chubbo-chat.firebaseio.com/surveys.json?auth=' + authToken);
    });
  }
}
