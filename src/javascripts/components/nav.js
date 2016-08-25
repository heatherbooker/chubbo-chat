//libraries
import Vue from 'vue';
import '../../libs/bootstrap/css/bootstrap.css'
//vuex shared state store
import store from '../store.js'
// Services
import surveyService from '../services/surveyService.js';


export default Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4" v-if="!onSimpleNav">
          <div v-show="onDashboard">
            <p
              v-show="!user"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-on:click='handleLogout'
              class="cc-logoutBtn"
            >
              logout
            </p>
          </div>
          <div v-else>
            <p
              v-show="!user"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-link="{path: '/dashboard'}"
              class="cc-dashboardShortcut"
            >
              dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  computed: {
    onDashboard: function() {
      //dashboard: show menu icon or logout btn (based on css media queries)
      //landing: show dashboard shortcut or login btn (based on user login status)
      return (this.$route.path.substring(0, 10) === '/dashboard');
    },
    onSimpleNav: function() {
      // Conversation page: login option is not available, therefore no need to show login button.
      return (this.$route.path.substring(0, 8) === '/surveys');
    }
  },
  methods: {
    handleLogin: function() {
      if (this.onDashboard) {
        // Save user's half-written survey before they are redirected to sign in.
        // Last arg is false to indicate this survey should not be published.
        surveyService.setLocalSurvey(this.survey.title, this.survey.questions, false);
      }
      window.ChubboChat.services.login.signIn();
    },
    handleLogout: function() {
      window.ChubboChat.services.login.signOut()
          .then(() => {window.location.href = '/'});
      // Clean up so that if there was a local survey, it is not
      // found erroneously next time page is loaded or when user clicks 'Publish'.
      window.sessionStorage.removeItem('cc-userSurvey');
    }
  },
  //vuex(state store) getter(s) and action dispatchers needed by this component
  vuex: {
    getters: {
      user: function(state) {return state.user;},
      survey: function(state) {return state.selectedSurvey;}
    }
  }
});
