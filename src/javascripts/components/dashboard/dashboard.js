//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//components
import leftPanel from './leftPanel.js'
//styles
import '../../../stylesheets/dashboard.css'


export default Vue.extend({
  template: `
    <div class="cc-dashboardPage">
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
        <left-panel></left-panel>
      <router-view></router-view>
    </div>
  `,
  components: {
    'left-panel': leftPanel
  },
  created: function() {
    this.hideMenuMobile();
    this.createNewSurvey();
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;}
    },
    actions: {
      hideMenuMobile: function() {store.dispatch('toggleLeftPanel', false);},
      createNewSurvey: function() {store.dispatch('startDraft');}
    }
  }
});
