//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//styles
import '../../../stylesheets/leftPanel.css'

export default Vue.extend({
  props: ['isLoggedIn', 'surveys'],
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
      <button
        class="cc-newSurveyBtn"
        v-show="isLoggedIn"
        v-link="{path: '/dashboard/surveys/$creating_survey'}"
        @click="hideMenu"
      >
        + Create Survey
      </button>
      <div class="cc-leftPanel-surveyList" v-if="isLoggedIn">
        <div
          v-for="survey in surveys"
          track-by="id"
          v-if="survey.id !== '$creating_survey'"
          v-link="{path: pathRoot + survey.id}"
          class="cc-leftPanel-survey"
          @click="hideMenu"
        >
          {{ survey.title || survey.surveyTitle }}
        </div>
      </div>
    </div>
  `,
  computed: {
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
      // Clean up so that if there was a local survey, it is not
      // found erroneously next time page is loaded or when user clicks 'Publish'.
      window.sessionStorage.removeItem('cc-userSurvey');
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
