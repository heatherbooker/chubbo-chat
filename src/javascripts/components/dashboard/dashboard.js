//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
// services
import surveyService from '../../services/surveyService.js';
import surveyApi from '../../services/surveyApi.js'
//components
import leftPanel from './leftPanel.js'
import subNav from './subNav.js'
import rightPanel from './rightPanel.js'
//styles
import '../../../stylesheets/dashboard.css'


export default Vue.extend({
  route: {
    activate(transition) {
      window.ChubboChat.services.login.getUserAfterRedirect()
          .then((user) => {
            if (user) {
              this.setUser(user);
            }
          })
          .then(() => {
            surveyService.getPublishedSurveys(this.user)
              .then((surveys) => {
                this.addSurveysToStore(surveys);
                transition.next();
              }, () => {
                transition.next();
              });
          });
    },
    data: function(transition) {
      var currentSurveyId = this.$route.params.surveyId;

      if (!currentSurveyId) {
        var latestSurveyId = surveyService.getLatestSurveyId(this.surveys);
        transition.redirect(`/dashboard/surveys/${latestSurveyId}`);

      } else if (currentSurveyId !== '$creating_survey') {
        this.setSelectedSurvey(surveyService.getSurveyById(currentSurveyId, this.surveys));
        transition.next();

      } else if (window.sessionStorage.getItem('cc-userSurvey')) {
        var localSurvey = JSON.parse(window.sessionStorage.getItem('cc-userSurvey'));
        // Clean up so that if there was a local survey, it is not
        // found erroneously next time page is loaded or when user clicks 'Publish'.
        window.sessionStorage.removeItem('cc-userSurvey');
        this.addSurveyToStore(localSurvey);
        this.setSelectedSurvey(localSurvey);
        transition.next();

      } else {
        // Create a new blank survey and set it as the selected survey.
        this.addSurveyToStore();
        this.setSelectedSurvey();
        transition.next();
      }
    }
  },
  template: `
    <sub-nav></sub-nav>
    <div class="cc-dashboardPage">
      <div class="cc-dashboard-mobileUnavailable">
        <h1>
          Unfortunately, mobile survey editing is not available at this time.
          Please let us know if you are interested in seeing this feature!
        </h1>
      </div>
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
      <left-panel></left-panel>
      <div class="cc-dashboard-main">
        <router-view v-if="!$loadingRouteData"></router-view>
      </div>
      <right-panel v-show="$route.path.substring(11, 20) !== 'responses'"></right-panel>
    </div>
  `,
  components: {
    'left-panel': leftPanel,
    'sub-nav': subNav,
    'right-panel': rightPanel
  },
  ready: function() {
    document.addEventListener('CC.NEW_USER', () => {
      surveyService.getPublishedSurveys(this.user)
          .then((surveys) => {
            this.addSurveysToStore(surveys);
          });
    });
  },
  methods: {
    addSurveysToStore(surveys) {
      for (var surveyKey in surveys) {
        var survey = surveys[surveyKey];
        survey.id = surveyKey;
        survey.isPublished = true;
        this.addSurveyToStore(survey);
      }
    }
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      surveys: function(state) {return state.surveys;},
      user: function(state) {return state.user;}
    },
    actions: {
      addSurveyToStore: function(store, survey) {
        store.dispatch('ADD_SURVEY', survey);
      },
      setSelectedSurvey: function(store, survey) {
        store.dispatch('SET_SELECTED_SURVEY', survey);
      },
      setUser(store, user) {
        store.dispatch('SET_USER', user);
      }
    }
  }
});
