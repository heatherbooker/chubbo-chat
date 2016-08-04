(function() {

  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);
  console.log(isIE);

  var requestFrame = (function() {
    var reqAnimFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 20);
      };
      return function(callback) { return reqAnimFrame(callback); };
  })();

  var cancelFrame = (function() {
    var cancel =
      window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.clearTimeout;
    return function(id) { return cancel(id); };
  })();

  function resizeListener(event) {
    var win = event.target || event.srcElement;
    if (win.resizeReqAnimFrame) {
      cancelFrame(win.resizeReqAnimFrame);
    }
    win.resizeReqAnimFrame = requestFrame(function() {
      var trigger = window.resizeTrigger;
      trigger.resizeListeners.forEach(function(callback) {
        callback.call(trigger, event);
      });
    });
  }

  function objectLoad(event) {
    this.contentDocument.defaultView.resizeTrigger = this.resizeElement;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }

  var addResizeListener = function(element, callback) {
    if (!element.resizeListeners) {
      element.resizeListeners = [];
      if (attachEvent) {
        element.resizeTrigger = element;
        element.attachEvent('onresize', resizeListener);
      } else {
        if (getComputedStyle(element).position == 'static') {
          element.style.position = 'relative';
        }
        var obj = element.resizeTrigger = document.createElement('object');
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        obj.resizeElement = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.resizeListeners.push(callback);
  }

  var removeResizeListener = function(element, callback) {
    element.resizeListeners.splice(element.resizeListeners.indexOf(callback), 1);
    if (!element.resizeListeners.length) {
      if (attachEvent) {
        element.detachEvent('onresize', resizeListener);
      } else {
        element.resizeTrigger.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.resizeTrigger = !element.removeChild(element.resizeTrigger);
      }
    }
  }

  window.ChubboChat.services.stickyScroll = {
    addResizeListener,
    removeResizeListener
  };

})();