//libraries
import Vue from 'vue'
// Services
import htmlService from '../../services/htmlService.js';
// Styles
import '../../../stylesheets/slider.css';


export default Vue.extend({
  props: ['question', 'selected', 'editable', 'index', 'canClickHiBtn'],
  template: `
    <div class="cc-questionBlock-container">
      <img :src="srcForDragIcon" class="cc-questionBlock-dragIcon" v-if="editable">
      <div :class="selected ? 'cc-questionBlock-selected' : 'cc-questionBlock'">
        <div :class="questionBlockClass">
          {{{ questionText || defaultText }}}
        </div>
        <div
          v-if="question.type === 'slider'"
          class="cc-questionBlock-bottom-slider"
        >
          <label class="cc-questionBlock-sliderLabel">{{{ questionLeft || '[]' }}}</label>
          <input
            type='range'
            class="cc-questionBlock-slider"
            :class="'slider' + index"
            min="0"
            max="100"
            @click.stop
          >
          <label class="cc-questionBlock-sliderLabel">{{{ questionRight || '[]' }}}</label>
        </div>
        <div
          v-if="question.type === 'options'"
          class="cc-questionBlock-bottom"
        >
          <div v-for="option in question.options" track-by="$index">
            <label class="cc-radioLabel">
              <input
                type="radio"
                :value="option"
                :name="'options' + index"
                :class="'options' + index"
              >
              <span>{{{ htmlPrepare(option) }}}</span>
            </label>
          </div>
        </div>
        <div v-if="question.type === 'buttons'" class="cc-questionBlock-bottom-buttons">
          <button
            v-for="button in question.buttons"
            :class="canClickHiBtn || button !== 'Ready!' ? 'cc-questionBlock-button' : 'cc-questionBlock-button-disabled'"
            @click="handleBtnClicked(button)"
          >{{{ htmlPrepare(button) }}}</button>
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
    },
    questionText() {
      return htmlService.prepareText(this.question.text);
    },
    questionLeft() {
      return htmlService.prepareText(this.question.left);
    },
    questionRight() {
      return htmlService.prepareText(this.question.right);
    }
  },
  methods: {
    deleteQuestion() {
      this.$dispatch('delete-question');
    },
    htmlPrepare(text) {
      return htmlService.prepareText(text);
    },
    handleBtnClicked(button) {
      this.$dispatch('button-clicked', button);
    }
  }
});
