// Libraries
import Vue from 'vue';
import '../../../libs/selectBox/jquery.selectBox.js';
// Vuex state store
import store from '../../store.js';
// Components
import editOptions from './rightPanel/editOptions.js';
// Styles 
import '../../../libs/selectBox/jquery.selectBox.css';
import '../../../stylesheets/rightPanelEdit.css';


export default Vue.extend({
  props: ['types', 'survey'],
  template: `
      <form class="cc-rightPanel-edit">
        <div class="cc-rightPanel-edit-row">
          <label for="cc-editPanel-selectType">
            Type
          </label>
          <select
            class="cc-rightPanel-edit-select"
            id="cc-editPanel-selectType"
            :value="survey.questions[survey.currentQuestionIndex].type || ''"
          >
            <option
              v-for="type in types"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>
        <div class="cc-rightPanel-edit-row">
          <label style="display: none" for="cc-editPanel-editText">Text</label>
          <input
            type="text"
            :value="survey.questions[survey.currentQuestionIndex].text || ''"
            class="cc-questionInput"
            id="cc-editPanel-editText"
            placeholder="Type question here..."
            @input="handleTextInput"
            @keyup.enter.prevent
            autocomplete="off"
          >
        </div>
        <edit-options @updateOption="handleTextInput(event)"></edit-options>
      </form>
  `,
  components: {
    'edit-options': editOptions
  },
  ready() {
    var me = this;
    $('#cc-editPanel-selectType').selectBox();
    $('#cc-editPanel-selectType').change(function() {
      me.emitEvent('edit-type', $(this).val());
    });
  },
  watch: {
    'survey.questions[survey.currentQuestionIndex].type': function(val) {
      $('#cc-editPanel-selectType').selectBox('value', val);
    }
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
