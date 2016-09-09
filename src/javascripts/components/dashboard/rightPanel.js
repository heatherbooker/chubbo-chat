// Libraries
import Vue from 'vue';
// Vuex state store
import store from '../../store.js';
// Components
import editPanel from './rightPanelEdit.js';
// Styles
import '../../../stylesheets/rightPanel.css'


export default Vue.extend({
  // Some buttons in template are "display: none" because their types are not yet implemented.
  template: `
    <div :class="survey.isPublished ? 'cc-rightPanel-disabled' : 'cc-rightPanel'">
      <div class="cc-rightPanel-tabBar">
        <div
          :class="classForNewTab"
          @click="setClickedTab('new')"
        >
          <h3 class="cc-rightPanel-tabText">New</h3>
        </div>
        <div
          :class="classForEditTab"
          @click="setClickedTab('edit')"
        >
          <h3 class="cc-rightPanel-tabText">Edit</h3>
        </div>
      </div>
      <div v-show="selectedTab === 'new'" class="cc-rightPanel-btnsDiv">
        <div class="cc-rightPanel-btnsLeftCol">
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(0)">
            <span class="fa fa-3x fa-pencil cc-rightPanel-btnIcon"></span>
            <h4>Text</h4>
          </button>
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(1)">
            <span class="fa fa-3x fa-check-square-o cc-rightPanel-btnIcon"></span>
            <h4>Options</h4>
          </button>
          <button style="display: none" class="cc-rightPanel-btn" @click="handleNewQuestionBtn(2)">
            <span class="fa fa-3x fa-picture-o cc-rightPanel-btnIcon"></span>
            <h4>Image</h4>
          </button>
        </div>
        <div class="cc-rightPanel-btnsRightCol">
          <button style="display: none" class="cc-rightPanel-btn" @click="handleNewQuestionBtn(3)">
            <span class="fa fa-3x fa-envelope-o cc-rightPanel-btnIcon"></span>
            <h4>Email</h4>
          </button>
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(4)">
            <span class="fa fa-3x fa-sliders cc-rightPanel-btnIcon"></span>
            <h4>Slider</h4>
          </button>
        </div>
      </div>
      <edit-panel
        v-if="selectedTab === 'edit'"
        :question="survey.questions[survey.currentQuestionIndex]"
        :types="questionTypes"
        @edit-text="editQuestionText"
        @add-option="addOption"
        @edit-option="editOption"
        @delete-option="deleteOption"
        @edit-slider-left="editSliderLeftValue"
        @edit-slider-right="editSliderRightValue"
      ></edit-panel>
    </div>
  `,
  components: {
    'edit-panel': editPanel
  },
  data() {
    return {
      questionTypes: ['text', 'options', 'image', 'email', 'slider'],
      selectedTabClass: 'cc-rightPanel-tab-selected',
      disabledTabClass: 'cc-rightPanel-tab-disabled',
      tabClass: 'cc-rightPanel-tab',
      clickedTab: 'new',
    }
  },
  computed: {
    classForNewTab() {
      if (this.selectedTab === 'new') {
        return this.selectedTabClass;
      }
      return this.tabClass;
    },
    classForEditTab() {
      if (this.survey.questions.length < 1) {
        return this.disabledTabClass;
      } else if (this.selectedTab === 'edit') {
        return this.selectedTabClass;
      }
      return this.tabClass;
    },
    selectedTab() {
      if (this.survey.isPublished || this.survey.questions.length < 1) {
        return 'new';
      }
      return this.clickedTab;
    }
  },
  methods: {
    handleNewQuestionBtn(questionReferenceNum) {
      this.addQuestion(this.questionTypes[questionReferenceNum]);
    },
    setClickedTab(tab) {
      this.clickedTab = tab;
    }
  },
  // Vuex (state store) getters / action dispatchers needed by this component 
  vuex: {
    getters: {
      survey(state) {return state.selectedSurvey;},
      currentQuestion(state) {
        var survey = state.selectedSurvey;
        return survey.questions[survey.currentQuestionIndex];
      }
    },
    actions: {
      addQuestion(store, questionType) {
        store.dispatch('ADD_QUESTION', questionType);
      },
      editQuestionText(store, text) {
        store.dispatch('EDIT_QUESTION', 'text', text);
      },
      addOption() {
        var optionsArray = [...this.currentQuestion.options];
        optionsArray.push('');
        store.dispatch('EDIT_QUESTION', 'options', optionsArray);
      },
      editOption(store, index, optionText) {
        var optionsArray = [...this.currentQuestion.options];
        optionsArray[index] = optionText;
        store.dispatch('EDIT_QUESTION', 'options', optionsArray);
      },
      deleteOption(store, index) {
        var optionsArray = [...this.currentQuestion.options];
        optionsArray.splice(index, 1);
        store.dispatch('EDIT_QUESTION', 'options', optionsArray);
      },
      editSliderLeftValue(store, value) {
        store.dispatch('EDIT_QUESTION', 'left', value);
      },
      editSliderRightValue(store, value) {
        store.dispatch('EDIT_QUESTION', 'right', value);
      }
    }
  }
});
