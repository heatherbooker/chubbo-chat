import Vue from 'vue'
import anchorme from '../../../libs/anchorme.js'
import store from '../../store.js'


export default Vue.extend({
  props: ['message'],
  template: `
    <div :class="classNames.row">
      <div :class="classNames.message">
        {{{finalMessage}}}
      </div>
    </div>
  `,
  computed: {
    classNames: function() {
      if (this.message.sender === 'bot') {
        return {
          row: 'cc-chatRow-bot',
          message: 'cc-chatBubble-bot'
        };
      }
      return {
        row: 'cc-chatRow-reply',
        message: 'cc-chatBubble-reply'
      };
    },
    finalMessage: function() {
      var htmlEscapedMessage = this.escapeHtml(this.message.text);
      //anchorme plugin wraps URLs in <a> tags
      var messageWithLinksEncoded = anchorme.js(htmlEscapedMessage, {html: false});
      var wholeMessage = messageWithLinksEncoded.join(' ');
      //remove extra spaces inserted by anchorme
      var wholeMessageTidied = this.removeSpaces(wholeMessage);
      //html encode forward slash unless in </a>
      return wholeMessageTidied.replace(/\/(?!a>)/g, '&#x2F;');
    }
  },
  methods: {
    escapeHtml: function(message) {
      return message
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    removeSpaces: function(message) {
      return message
        .split(" \n ").join("\n")
        .split(" ( ").join("(")
        .split(" ) ").join(")")
        .split(" [ ").join("[")
        .split(" ] ").join("]")
        .split(" < ").join("<")
        .split(" > ").join(">")
        .split(" &#39; ").join("&#39;")
        .split(" &quot; ").join("&quot;");
    }
  }
});
