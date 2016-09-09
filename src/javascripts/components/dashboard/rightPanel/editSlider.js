// Libraries
import Vue from 'vue';


export default Vue.extend({
  props: ['left', 'right'],
  template: `
    <div class="cc-rightPanel-edit-row">
      <label class="cc-sliderInput-label">Left</label>
      <input
        type="text"
        :value="left"
        @input="editLeft"
        class="cc-editPanel-textInput-slider"
      >
    </div>
    <div class="cc-rightPanel-edit-row">
      <label class="cc-sliderInput-label">Right</label>
      <input
        type="text"
        :value="right"
        @input="editRight"
        class="cc-editPanel-textInput-slider"
      >
    </div>
  `,
  methods: {
    editLeft(event) {
      this.$dispatch('edit-slider-left', event.target.value);
    },
    editRight(event) {
      this.$dispatch('edit-slider-right', event.target.value);
    }
  }
});
