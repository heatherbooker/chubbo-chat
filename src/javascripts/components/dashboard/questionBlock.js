//libraries
import Vue from 'vue'
// Styles
import '../../../stylesheets/slider.css';


export default Vue.extend({
  props: ['question', 'selected', 'editable'],
  template: `
    <div class="cc-questionBlock-container">
      <img :src="srcForDragIcon" class="cc-questionBlock-dragIcon">
      <div :class="selected ? 'cc-questionBlock-selected' : 'cc-questionBlock'">
        <div :class="questionBlockClass">
          {{ question.text || defaultText }}
        </div>
        <div
          v-if="question.type === 'slider'"
          class="cc-questionBlock-bottom-slider"
        >
          <label class="cc-questionBlock-sliderLabel">{{ question.left || '[]'}}</label>
          <input type='range' class="cc-questionBlock-slider" @click.stop>
          <label class="cc-questionBlock-sliderLabel">{{ question.right || '[]' }}</label>
        </div>
        <div
          v-if="question.type === 'options'"
          class="cc-questionBlock-bottom"
        >
          <div v-for="option in question.options" track-by="$index">
            <label class="cc-radioLabel">
              <input type="radio" :value="option" name="options">
              <span>{{ option }}</span>
            </label>
          </div>
        </div>
      </div>
      <img
        v-if="editable"
        :src="srcForDeleteIcon"
        class="cc-questionBlock-garbageIcon"
        @click="deleteQuestion"
      >
    </div>
  `,
  data() {
    return {
      defaultText: '[Go to the edit panel to modify this question]',
      srcForDragIcon: require('../../../images/drag.svg'),
      srcForDeleteIcon: require('../../../images/garbage.svg')
    };
  },
  computed: {
    questionBlockClass() {
      if (this.question.type === 'text') {
        return 'cc-questionBlock-topOnly';
      }
      return 'cc-questionBlock-top';
    }
  },
  methods: {
    deleteQuestion() {
      this.$dispatch('delete-question');
    }
  }
});
