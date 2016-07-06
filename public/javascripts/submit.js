$(document).ready(function() {

  $(document).keypress(function(e) {
    if(e.which == 13) {
      handleSubmit();
    }
  });

  $('#submit').click(handleSubmit);

});

function handleSubmit() {
  var message = $('#messageInput').val();
  $('#messageInput').val('');

  var settings = {
    "url": "/reverse",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "data": "{\"message\": \""+message+"\"}"
  }

  $.ajax(settings).done(function (response) {
    $('.incoming').append(response + '<br />');
    $('.outgoing').append(message + '<br />');
  });
}
