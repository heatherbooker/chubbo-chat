import Vue from 'vue';
import store from '../../../store.js';


export default Vue.extend({
  props: ['options'],
  template: `
    <div
      v-for="(index, option) in options"
      class="cc-rightPanel-edit-row"
      track-by="$index"
    >
      <label style="display: none" :for="'cc-optionInput' + index">smthign dynamic</label>
      <input
        type="text"
        :id="'cc-optionInput' + index"
        class="cc-optionInput"
        :value="option"
        @input="editOption"
        @keydown.enter.prevent="addOption"
        autocomplete="off"
      >
      <img
        :src="srcForDeleteIcon"
        class="cc-rightPanel-garbageIcon"
        @click="deleteOption(index)"
      >
    </div>
    <div class="cc-rightPanel-edit-row">
      <button
        class="cc-buttonReset cc-rightPanel-addOptionBtn"
        @click.prevent="addOption"
      >Add Option</button>
    </div>
  `,
  data() {
    return {
      srcForDeleteIcon: require('../../../../images/garbage.svg')
    };
  },
  methods: {
    addOption() {
      this.$dispatch('add-option');
      // Waits for option to be added to DOM before moving focus to it.
      this.$nextTick(function() {
        $('#cc-optionInput' + [this.options.length - 1]).focus();
      });
    },
    editOption(event) {
      var index = event.target.id[event.target.id.length - 1];
      var text = event.target.value;
      this.$dispatch('edit-option', index, text);
    },
    deleteOption(index) {
      this.$dispatch('delete-option', index);
    }
  }
});
