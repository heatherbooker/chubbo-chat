window.ChubboChat.services.surveyApi = {
  publishSurvey: function(userName, title, questions) {
    function setAjaxSettings(authToken) {
      return {
        url: 'https://chubbo-chat.firebaseio.com/surveys.json?auth=' + authToken,
        method: 'POST',
        data: `{
          "author": "${userName}",
          "surveyTitle": "${title}",
          "questions": "${questions}"
        }`
      };
    };
    firebase.auth().currentUser.getToken().then(function(token) {
      $.ajax(setAjaxSettings(token)).done(function (response) {
        sweetAlert({
          title: 'Survey successfully published!',
          type: 'success'
        });
      });
    });
  }
}