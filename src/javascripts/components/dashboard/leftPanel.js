//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
// Services
import 'vue-sticky-scroll';
import surveyApi from '../../services/surveyApi.js';
//styles
import '../../../stylesheets/leftPanel.css'

export default Vue.extend({
  template: `
    <div class="cc-leftPanel">
      <img :src="userImgSrc" class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel">
        {{ user ? user.email : 'not signed in' }}
      </p>
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
      <div class="cc-leftPanel-surveyList" v-if="user" v-sticky-scroll>
        <div
          v-for="survey in surveys | orderBy 'timestamp'"
          track-by="id"
          v-if="survey.isPublished"
          v-link="{path: pathRoot + survey.id}"
          class="cc-leftPanel-survey"
        >
          <span>{{ survey.title || survey.surveyTitle }}</span>
          <img
            :src="srcForDeleteIcon"
            class="cc-leftPanel-garbageIcon"
            @click.stop="deleteSurvey(survey.id)"
          >
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      srcForDeleteIcon: require('../../../images/garbage.svg')
    };
  },
  computed: {
    pathRoot: function() {
      if (this.$route.path.substring(11, 18) === 'surveys') {
        return '/dashboard/surveys/';
      }
      return '/dashboard/responses/';
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
    },
    deleteSurvey(id) {
      swal({
        title: 'Are you sure?',
        html: `You will <strong>permanently</strong> lose this survey as well as
               all of the responses it may have associated with it!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete this survey',
        cancelButtonText: 'No, cancel'
      }).then(() => {
        return surveyApi.deleteSurvey(id);
      }).then((response) => {
        if (response.ok) {
          this.deleteSurveyFromStore(id);
          if (this.$route.params.surveyId === id) {
            this.$router.go('/dashboard/surveys/$creating_survey');
          }
        }
      });
    }
  },
  //vuex(state store) action dispatchers / getter(s) needed by this component
  vuex: {
    getters: {
      user: function(state) {return state.user},
      surveys: function(state) {return state.surveys;}
    },
    actions: {
      deleteSurveyFromStore(store, id) {
        store.dispatch('DELETE_SURVEY', id);
      }
    }
  }
});
