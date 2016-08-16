//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//styles
import '../../../stylesheets/leftPanel.css'

export default Vue.extend({
  props: ['isLoggedIn', 'surveysProp'],
  template: `
    <div v-bind:class="isLeftPanelVisible ? 'cc-leftPanel-mobile-show' : 'cc-leftPanel-mobile-hide'">
      <img v-bind:src=userPic class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ emailField }} </p>
      <p
        v-link="{path: '/'}"
        v-on:click="handleLogout"
        class="cc-logout-leftPanel"
        v-show="isLoggedIn"
      > logout </p>
      <hr class="cc-leftPanel-seperatingLine" v-show="!isLoggedIn">
      <button class="cc-newSurveyBtn" v-show="isLoggedIn">+ Create Survey</button>
      <div class="cc-leftPanel-surveyList" v-if="surveys.length > 0">
        <div
          v-for="survey in surveys"
          @click="toggleSelectedSurvey(survey)"
          v-link="{path: pathRoot + survey.title}"
          :class="survey.isSelected ? 'cc-leftPanel-survey-selected' : 'cc-leftPanel-survey'"
        >
          {{ survey.title }}
        </div>
      </div>
    </div>
  `,
  computed: {
    surveys: function() {
      return this.surveysProp.map(survey => survey);
    },
    pathRoot: function() {
      if (this.$route.path.substring(11, 18) === 'surveys') {
        return '/dashboard/surveys/';
      }
      return '/dashboard/responses/';
    }
  },
  methods: {
    handleLogout: function() {
      window.ChubboChat.services.login.signOut();
    },
    toggleSelectedSurvey: function(clickedSurvey) {
      this.surveys.forEach((survey) => {
        survey.isSelected = false;
      });
      clickedSurvey.isSelected = true;
    }
  },
  //vuex(state store) action dispatchers / getter(s) needed by this component
  vuex: {
    actions: {
      hideMenu: function() {store.dispatch('toggleLeftPanel', false);}
    },
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;},
      emailField: function(state) {return state.userInfo.email;},
      userPic: function(state) {return state.userInfo.imgSrc}
    }
  }
});
