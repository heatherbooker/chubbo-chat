//libraries
import Vue from 'vue'
// Services
import htmlService from '../../services/htmlService.js';
// Components
import questionBlock from '../dashboard/questionBlock.js';


export default Vue.extend({
  props: ['message', 'index', 'canClickHiBtn'],
  template: `
    <div :class="classNames.row">
      <div v-if="this.message.sender === 'user'" :class="classNames.message">
        {{{finalMessage}}}
      </div>
      <question-block
        v-else
        :question='message'
        :index="index"
        :can-click-hi-btn="canClickHiBtn"
        @button-clicked="handleBtnClick"
      ></question-block>
    </div>
  `,
  components: {
    'question-block': questionBlock
  },
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
  },
  methods: {
    handleBtnClick(button) {
      this.$dispatch('button-clicked', button);
    }
  }
});
