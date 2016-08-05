// scroll chat-messages div to bottom whenever new message is added
window.ChubboChat.services.stickyScroll = function(elementClassOrId) {

  var target = document.querySelector(elementClassOrId);

  var observer = new MutationObserver(scrollToBottom);
  var config = { childList: true };
  observer.observe(target, config);

  function scrollToBottom() {
    $(elementClassOrId)
      .scrollTop($(elementClassOrId)
      .prop("scrollHeight"));
  }

};
