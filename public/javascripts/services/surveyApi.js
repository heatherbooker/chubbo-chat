window.ChubboChat.services.surveyApi = {

  publishSurvey: function(survey) {
    var user = firebase.auth().currentUser;
    //returns promise with authentication token
    var tokenPromise = user.getToken();

    //return fetch promise to caller 
    return tokenPromise.then(function(authToken) {
      return fetch(`https://chubbo-chat.firebaseio.com/users/${user.uid}/surveys.json?auth=` + authToken, {
        method: 'post',
        body: survey
      });
    });
  },

  getSurveys: function() {
    var user = firebase.auth().currentUser;
    var tokenPromise = user.getToken();

    return tokenPromise.then(function(authToken) {
      return fetch(`https://chubbo-chat.firebaseio.com/users/${user.uid}/surveys.json?auth=` + authToken);
    });
  },

  getSpecificSurvey: function(userId, surveyId) {
    return fetch(`https://chubbo-chat.firebaseio.com/users/${userId}/surveys/${surveyId}.json`);
  },

  sendSurveyResponses: function(userId, surveyId, surveyResponses) {
    return fetch(`https://chubbo-chat.firebaseio.com/users/${userId}/surveys/${surveyId}/responses.json`, {
      method: 'post',
      body: surveyResponses
    });
  },

  getSurveyResponses: function(userId, surveyId) {
    return fetch(`https://chubbo-chat.firebaseio.com/users/${userId}/surveys/${surveyId}/responses.json`);
  }
  
}
