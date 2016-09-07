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
        :value="options[index]"
        @input="editOption"
        @keyup.enter.prevent
        autocomplete="off"
      >
      <img :src="srcForDeleteIcon" class="cc-rightPanel-garbageIcon">
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
    addOption() {console.log('adding');this.$dispatch('add-option');},
    editOption(event) {
      this.$dispatch('update-option', event);
    }
  }
});
