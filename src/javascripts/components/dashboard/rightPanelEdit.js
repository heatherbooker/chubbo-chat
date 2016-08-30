// Libraries
import Vue from 'vue';
import '../../../libs/selectBox/jquery.selectBox.js';
// Vuex state store
import store from '../../store.js';
// Styles 
import '../../../libs/selectBox/jquery.selectBox.css';
import '../../../stylesheets/rightPanelEdit.css';


export default Vue.extend({
  props: ['types'],
  template: `
      <form class="cc-rightPanel-edit">
        <fieldset>
          <div class="cc-rightPanel-edit-row">
            <label for="cc-editPanel-selectType">
              Type
            </label>
            <select class="cc-rightPanel-edit-select" id="cc-editPanel-selectType">
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
              v-model=question
              class="cc-questionInput"
              id="cc-editPanel-editText"
              placeholder="Type question here..."
              v-on:keyup="updateQuestionInStore(index, question)"
            >
          </div>
        </fieldset>
      </form>
  `,
  data() {
    return {
      typeSelected: 'text',
      question: '',
      index: 0
    }
  },
  ready() {
    $('select').selectBox();
    $('#cc-questionInput').blur(() => {this.updateQuestionInStore(this.index, this.question)});
  },
  // Vuex(state store) getters / action dispatcher(s) needed by this component.
  vuex: {
    actions: {
      updateQuestionInStore: function(store, index, question) {
        store.dispatch('EDIT_QUESTION', index, question);
      }
    }
  }
});
