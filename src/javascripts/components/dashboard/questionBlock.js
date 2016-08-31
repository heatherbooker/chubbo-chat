//libraries
import Vue from 'vue'


export default Vue.extend({
  props: ['question'],
  template: `
    <div class="cc-questionBlock-container">
      <img :src="srcOfDragIcon" class="cc-questionBlock-dragIcon">
      <div class="cc-questionBlock">
        <div :class="questionBlockClass">
          {{ question.text || defaultText }}
        </div>
        <div v-if="false" class="cc-questionBlock-bottom">
          other stuff will go here
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      defaultText: '[Go to the edit panel to modify this question]',
      srcOfDragIcon: require('../../../images/drag.svg')
    };
  },
  computed: {
    questionBlockClass() {
      if (this.question.type === 'text') {
        return 'cc-questionBlock-topOnly';
      }
      return 'cc-questionBlock-top';
    }
  }
});
