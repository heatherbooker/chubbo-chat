// Libraries
import Vue from 'vue';
// Vuex state store
import store from '../../store.js';
// Components
import editOptions from './rightPanel/editOptions.js';
// Styles 
import '../../../stylesheets/rightPanelEdit.css';


export default Vue.extend({
  props: ['question'],
  template: `
      <form class="cc-rightPanel-edit">
        <div class="cc-rightPanel-edit-row">
          <label style="display: none" for="cc-editPanel-editText">Text</label>
          <input
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
          v-if="question.type === 'options'"
          @updateOption="handleTextInput(event)"
        ></edit-options>
      </form>
  `,
  components: {
    'edit-options': editOptions
  },
  methods: {
    emitEvent(eventName, eventDetail) {
      this.$dispatch(eventName, eventDetail);
    },
    handleTextInput(event) {
      this.emitEvent('edit-text', event.target.value);
    }
  }
});
