// Libraries
import Vue from 'vue';
// Vuex state store
import store from '../../store.js';
// Components
import editPanel from './rightPanelEdit.js';
// Styles
import '../../../stylesheets/rightPanel.css'


export default Vue.extend({
  template: `
    <div class="cc-rightPanel">
      <div class="cc-rightPanel-tabBar">
        <div
          :class="classForNewTab"
          @click="setSelectedTab('new')"
        >
          <h3 class="cc-rightPanel-tabText">New</h3>
        </div>
        <div
          :class="classForEditTab"
          @click="setSelectedTab('edit')"
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
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(2)">
            <span class="fa fa-3x fa-picture-o cc-rightPanel-btnIcon"></span>
            <h4>Image</h4>
          </button>
        </div>
        <div class="cc-rightPanel-btnsRightCol">
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(3)">
            <span class="fa fa-3x fa-envelope-o cc-rightPanel-btnIcon"></span>
            <h4>Email</h4>
          </button>
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(4)">
            <span class="fa fa-3x fa-sliders cc-rightPanel-btnIcon"></span>
            <h4>Sliders</h4>
          </button>
        </div>
      </div>
      <edit-panel v-if="selectedTab === 'edit'" :types="questionTypes"></edit-panel>
    </div>
  `,
  components: {
    'edit-panel': editPanel
  },
  data() {
    return {
      questionTypes: ['text', 'options', 'image', 'email', 'sliders'],
      selectedTabClass: 'cc-rightPanel-tab-selected',
      disabledTabClass: 'cc-rightPanel-tab-disabled',
      tabClass: 'cc-rightPanel-tab',
      selectedTab: 'new',
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
    }
  },
  methods: {
    handleNewQuestionBtn(questionReferenceNum) {
      this.addQuestion(this.questionTypes[questionReferenceNum]);
    },
    setSelectedTab(tab) {
      this.selectedTab = tab;
    }
  },
  // Vuex (state store) getters / action dispatchers needed by this component 
  vuex: {
    getters: {
      survey(state) {return state.selectedSurvey;}
    },
    actions: {
      addQuestion(store, questionType) {
        store.dispatch('ADD_QUESTION', questionType);
      }
    }
  }
});
