window.ChubboChat.services.surveyApi = {
  publishSurvey: function(userName, title, questions) {
    var authToken = JSON.parse(JSON.stringify(firebase.auth().currentUser)).stsTokenManager.accessToken;
    var settings = {
      url: 'https://chubbo-chat.firebaseio.com/surveys.json?auth=' + authToken,
      method: 'POST',
      data: `{
        "user": "`+ userName +`",
        "surveyTitle": "`+ title +`",
        "questions": "`+ questions +`"
      }`
    }
    $.ajax(settings).done(function (response) {
      sweetAlert({
        title: 'Survey successfully published!',
        type: 'success'
      });
    });
  }
}