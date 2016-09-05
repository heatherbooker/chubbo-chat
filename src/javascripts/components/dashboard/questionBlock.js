//libraries
import Vue from 'vue'


export default Vue.extend({
  props: ['question', 'selected'],
  template: `
    <div class="cc-questionBlock-container">
      <img :src="srcOfDragIcon" class="cc-questionBlock-dragIcon">
      <div :class="selected ? 'cc-questionBlock-selected' : 'cc-questionBlock'">
        <div :class="questionBlockClass">
          {{ question.text || defaultText }}
        </div>
        <div v-if="false" class="cc-questionBlock-bottom">
          options || slider || email input || file upload
        </div>
        <div
          v-if="question.type === 'options'"
          class="cc-questionBlock-bottom"
        >
          <div v-for="option in options">
            <label class="cc-radioLabel">
              <input type="radio" :value="option" name="options">
              <span>{{ option }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      options: ['one', 'two', 'threeeeeeeee'],
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
