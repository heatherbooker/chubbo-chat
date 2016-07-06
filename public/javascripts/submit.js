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
    "url": "https://localhost:3000/reverse",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "data": "{\"message\": \""+message+"\"}"
  }

  $.ajax(settings).done(function (response) {
    var reversed = reverse(response);
    $('.incoming').append(reversed + '<br />');
    $('.outgoing').append(response + '<br />');
  });
}

function reverse(message) {
  var reverseMessage = '';
  var messageMax = message.length;
  for (var i = 0; i < messageMax; i++) {
    reverseMessage = message.charAt(i) + reverseMessage;
  }
  return reverseMessage;
}