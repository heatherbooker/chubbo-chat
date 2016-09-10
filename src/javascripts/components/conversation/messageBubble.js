//libraries
import Vue from 'vue'
// Services
import htmlService from '../../services/htmlService.js';


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
    finalMessage() {
      return htmlService.prepareText(this.message.text);
    }
  }
});
