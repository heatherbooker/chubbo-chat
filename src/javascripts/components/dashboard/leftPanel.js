//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//styles
import '../../../stylesheets/leftPanel.css'

export default Vue.extend({
  template: `
    <div class="cc-leftPanel">
      <img v-bind:src="userImgSrc" class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ userEmail }} </p>
      <p
        v-on:click="handleLogout"
        class="cc-logout-leftPanel"
        v-show="user"
      > logout </p>
      <hr class="cc-leftPanel-seperatingLine" v-show="!user">
      <button
        class="cc-newSurveyBtn"
        v-show="user"
        v-link="{path: '/dashboard/surveys/$creating_survey'}"
      >
        + Create Survey
      </button>
      <div class="cc-leftPanel-surveyList" v-if="user">
        <div
          v-for="survey in surveys | orderBy 'timestamp'"
          track-by="id"
          v-if="survey.isPublished"
          v-link="{path: pathRoot + survey.id}"
          class="cc-leftPanel-survey"
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
    },
    userEmail: function() {
      if (this.user) {
        return this.user.email;
      }
      return 'not signed in';
    },
    userImgSrc: function() {
      if (this.user) {
        if (this.user.photoURL) {
          return this.user.photoURL;
        }
      }
      return 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    }
  },
  methods: {
    handleLogout: function() {
      window.ChubboChat.services.login.signOut()
          .then(() => {window.location.href = '/'});
      // Clean up so that if there was a local survey, it is not
      // found erroneously next time page is loaded or when user clicks 'Publish'.
      window.sessionStorage.removeItem('cc-userSurvey');
    }
  },
  //vuex(state store) action dispatchers / getter(s) needed by this component
  vuex: {
    getters: {
      user: function(state) {return state.user},
      surveys: function(state) {return state.surveys;}
    }
  }
});
