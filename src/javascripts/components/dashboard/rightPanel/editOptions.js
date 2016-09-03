import Vue from 'vue';
import store from '../../../store.js';


export default Vue.extend({
  template: `
    <div>
      <div v-for="(index, option) in options">
        <label style="display: none" :for="'cc-optionInput' + index">smthign dynamic</label>
        <input
          type="text"
          :id="'cc-optionInput' + index"
          :value="options[index]"
          @input="editOption"
          @keyup.enter.prevent
          autocomplete="off"
        >
      </div>
    </div>
  `,
  data() {
    return {
      options: ['a','b','c']
    };
  },
  methods: {
    addOption() {

    },
    editOption(event) {
      this.$dispatch('updateOption', event.target.value);
    },
    deleteOption() {

    }
  }
});
