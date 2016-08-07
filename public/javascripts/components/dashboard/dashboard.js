window.ChubboChat.components.dashboard = Vue.extend({
  data: function() {
    return {
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  created: function() {
    this.hideMenuMobile();
    this.createNewSurvey();
  },
  template: `
    <div class="cc-dashboardPage">
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
      <left-panel></left-panel>
      <survey-form v-if="dashboardView === 'survey'"></survey-form>
      <metrics-page v-else></metrics-page>
    </div>
  `,
  components: {
    'left-panel': window.ChubboChat.components.leftPanel,
    'survey-form': window.ChubboChat.components.surveyForm,
    'metrics-page': window.ChubboChat.components.metricsPage
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      dashboardView: function(state) {return state.dashboardView;},
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;}
    },
    actions: {
      hideMenuMobile: function() {this.store.dispatch('toggleLeftPanel', false);},
      createNewSurvey: function() {this.store.dispatch('startDraft');}
    }
  }
});
