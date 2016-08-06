window.ChubboChat.components.leftPanel = Vue.extend({
  template: `
    <div v-bind:class="isLeftPanelVisible ? 'cc-leftPanel-mobile-show' : 'cc-leftPanel-mobile-hide'">
      <img v-bind:src=userPic class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ emailField }} </p>
      <p v-link="{path: '/'}" v-on:click="handleLogout" class="cc-logout-leftPanel"> logout </p>
      <hr class="cc-leftPanel-seperatingLine">
      <p @click="handleSurveyBtn" :class="surveyBtnClass"> survey </p>
      <p @click="handleMetricsBtn" :class="metricsBtnClass"> metrics </p>
    </div>
  `,
  data: function() {
    return {
      surveyBtnClass: 'cc-leftPanel-surveyBtn-selected',
      metricsBtnClass: 'cc-leftPanel-metricsBtn',
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  methods: {
    handleLogout: function() {
      window.ChubboChat.services.login.signOut();
    },
    handleSurveyBtn: function() {
      this.showSurvey();
      this.surveyBtnClass = 'cc-leftPanel-surveyBtn-selected';
      this.metricsBtnClass = 'cc-leftPanel-metricsBtn';
    },
    handleMetricsBtn: function() {
      this.showMetrics();
      this.metricsBtnClass = 'cc-leftPanel-metricsBtn-selected';
      this.surveyBtnClass = 'cc-leftPanel-surveyBtn';
    }
  },
  //vuex(state store) getter(s) needed by this component
  vuex: {
    actions: {
      showSurvey: function() {this.store.dispatch('toggleDashboardView', 'survey')},
      showMetrics: function() {this.store.dispatch('toggleDashboardView', 'metrics')}
    },
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;},
      emailField: function(state) {return state.userInfo.email;},
      userPic: function(state) {return state.userInfo.imgSrc}
    }
  }
});
