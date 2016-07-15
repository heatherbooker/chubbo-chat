//register ChubboChat object on window to contain all globals
(function() {
  var ChubboChat = {
    store: {},
    components: {},
    services: {}
  };
  window.ChubboChat = ChubboChat;
})();
