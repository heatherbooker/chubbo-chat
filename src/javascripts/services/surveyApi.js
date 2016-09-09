var API_ENDPOINT = 'https://chubbo-chat.firebaseio.com';

export default {

  publishSurvey: function(survey) {
    var user = firebase.auth().currentUser;

    //return fetch promise to caller 
    return user.getToken().then(function(authToken) {
      return fetch(`${API_ENDPOINT}/users/${user.uid}/surveys.json?auth=` + authToken, {
        method: 'post',
        body: survey
      })
      .then(response => response.json())
      .then(data => ({surveyId: data.name, errorMsg: data.statusText}));
    });
  },

  getSurveys: function() {
    var user = firebase.auth().currentUser;

    return user.getToken().then(function(authToken) {
      return fetch(`${API_ENDPOINT}/users/${user.uid}/surveys.json?auth=` + authToken);
    });
  },

  getSpecificSurvey: function(userId, surveyId) {
    return fetch(`${API_ENDPOINT}/users/${userId}/surveys/${surveyId}.json`);
  },

  sendSurveyResponses: function(userId, surveyId, surveyResponses) {
    return fetch(`${API_ENDPOINT}/users/${userId}/surveys/${surveyId}/responses.json`, {
      method: 'post',
      body: surveyResponses
    });
  },

  getSurveyResponses: function(userId, surveyId) {
    return fetch(`${API_ENDPOINT}/users/${userId}/surveys/${surveyId}/responses.json`);
  },

  deleteSurvey: function(surveyId) {
    var user = firebase.auth().currentUser;

    return user.getToken().then(function(authToken) {
      return fetch(`${API_ENDPOINT}/users/${user.uid}/surveys/${surveyId}.json?auth=${authToken}`, {
        method: 'DELETE'
      });
    });
  }

};
