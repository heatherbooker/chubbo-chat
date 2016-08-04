// scroll chat-messages div to bottom whenever new message is added
window.ChubboChat.services.stickyScroll = function() {

  // request animation frame polyfill
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
  }());
  
  function stickyScroll() {
    var chubboStickyScroll = window.ChubboChat.services.stickyScroll;
    var chatMessagesDiv = document.querySelector('.cc-chat-messages');
    var currentDivHeight = chatMessagesDiv.scrollHeight;
    if (!chubboStickyScroll.divHeight) {
      chubboStickyScroll.divHeight = currentDivHeight;
    } else {
      if (chubboStickyScroll.divHeight !== currentDivHeight) {
        chubboStickyScroll.divHeight = currentDivHeight;
        $(".cc-chat-messages").animate({ scrollTop: $('.cc-chat-messages').prop("scrollHeight")}, 300);
      }
    }
    window.requestAnimationFrame(stickyScroll);
  }

  window.ChubboChat.services.stickyScroll = {divHeight: null};
  window.requestAnimationFrame(stickyScroll);

};