// Libraries
import Vue from 'vue';
// Vuex state store
import store from '../../store.js';
// Components
import editOptions from './rightPanel/editOptions.js';
import editSlider from './rightPanel/editSlider.js';
// Styles 
import '../../../stylesheets/rightPanelEdit.css';


export default Vue.extend({
  props: ['question'],
  template: `
      <form class="cc-rightPanel-edit">
        <span v-show="!question" class="cc-editPanel-errorMsg">
          Select a question from the center panel to edit!
        </span>
        <div class="cc-rightPanel-edit-row">
          <label style="display: none" for="cc-editPanel-editText">Text</label>
          <input
            v-if="question"
            type="text"
            :value="question.text || ''"
            class="cc-questionInput"
            id="cc-editPanel-editText"
            placeholder="Type question here..."
            @input="handleTextInput"
            @keyup.enter.prevent
            autocomplete="off"
          >
        </div>
        <edit-options
          v-if="question && question.type === 'options'"
          :options="question.options"
          @add-option="addOption"
          @edit-option="editOption"
          @delete-option="deleteOption"
        ></edit-options>
        <edit-slider
          v-if="question && question.type === 'slider'"
          :left="question.left"
          :right="question.right"
          @edit-slider-left="editSliderLeftValue"
          @edit-slider-right="editSliderRightValue"
        ></edit-slider>
      </form>
  `,
  components: {
    'edit-options': editOptions,
    'edit-slider': editSlider
  },
  methods: {
    addOption() {
      this.$dispatch('add-option');
    },
    handleTextInput(event) {
      this.$dispatch('edit-text', event.target.value);
    },
    editOption(index, text) {
      this.$dispatch('edit-option', index, text);
    },
    deleteOption(index) {
      this.$dispatch('delete-option', index);
    },
    editSliderLeftValue(value) {
      this.$dispatch('edit-slider-left', value);
    },
    editSliderRightValue(value) {
      this.$dispatch('edit-slider-right', value);
    }
  }
});
