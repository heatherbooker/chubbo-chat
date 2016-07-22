window.ChubboChat.services.surveyApi = {

  publishSurvey: function(data, callback) {
    firebase.auth().currentUser.getToken().then(function(authToken) {
      $.ajax({
        url: 'https://chubbo-chat.firebaseio.com/surveys.json?auth=' + authToken,
        method: 'POST',
        data
      }).done(function () {
        callback();
      }).fail(function () {
        console.log('unable to complete "publish survey" request');
      });
    });
  }
}