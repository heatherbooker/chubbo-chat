window.ChubboChat.components.messageBubble = Vue.extend({
  props: ['message', 'index'],
	template: `
    <div :class="message.sender === 'bot' ? 'cc-chatRow-bot' : 'cc-chatRow'">
      <div :class="message.sender === 'bot' ? 'cc-chatBubble-bot' : 'cc-chatBubble-reply'" :id="messageId">
        {{{finalMessage}}}
      </div>
    </div>
	`,
  computed: {
    finalMessage: function() {
      var htmlEscapedMessage = this.escapeHtml(this.message.text);
      var messageWithLinksEncoded = anchorme.js(htmlEscapedMessage, {html: false});
      console.log(messageWithLinksEncoded);
      var wholeMessage = messageWithLinksEncoded.join(' ');
      wholeMessage = wholeMessage.split(" \n ").join("\n");
      wholeMessage = wholeMessage.split(" ( ").join("(");
      wholeMessage = wholeMessage.split(" ) ").join(")");
      wholeMessage = wholeMessage.split(" [ ").join("[");
      wholeMessage = wholeMessage.split(" ] ").join("]");
      wholeMessage = wholeMessage.split(" < ").join("<");
      wholeMessage = wholeMessage.split(" > ").join(">");
      wholeMessage = wholeMessage.split(" &#39; ").join("&#39;");
      wholeMessage = wholeMessage.split(" &quot; ").join("&quot;");
      return wholeMessage;
    },
    messageId: function() {
      return 'cc-messageBubble' + this.index;
    }
  },
  methods: {
    escapeHtml: function(message) {
      return message
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;');
    }
  }
})