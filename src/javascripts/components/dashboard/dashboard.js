//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
// services
import surveyApi from '../../services/surveyApi.js'
//components
import leftPanel from './leftPanel.js'
import tabBar from './tabBar.js'
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
            this.getPublishedSurveys()
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
        var latestSurveyId = this.getLatestSurveyId(this.surveys);
        transition.redirect(`/dashboard/surveys/${latestSurveyId}`);

      } else if (currentSurveyId !== '$creating_survey') {
        this.setSelectedSurvey(this.getSurveyById(currentSurveyId, this.surveys));
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
        <tab-bar v-if="user"></tab-bar>
        <router-view v-if="!$loadingRouteData"></router-view>
      </div>
      <right-panel></right-panel>
    </div>
  `,
  components: {
    'left-panel': leftPanel,
    'tab-bar': tabBar,
    'right-panel': rightPanel
  },
  ready: function() {
    document.addEventListener('CC.NEW_USER', () => {
      this.getPublishedSurveys()
          .then((surveys) => {
            this.addSurveysToStore(surveys);
          });
    });
    this.hideMobileMenu();
  },
  methods: {
    getPublishedSurveys: function() {
      var promise = new Promise((resolve, reject) => {
        if (this.user) {
          return surveyApi.getSurveys()
              .then(response => response.json())
              .then((surveys) => {
                resolve(surveys);
              });
        } else {
          reject();
        }
      });
      return promise;
    },
    getSurveyById: function(id, surveys) {
      var surveyById;
      surveys.forEach((survey) => {
        if (survey.id === id) {
          surveyById = survey;
        }
      });
      return surveyById;
    },
    getLatestSurveyId: function(surveys) {
      var latestDate = 0;
      var latestSurveyId = '';

      surveys.forEach((survey) => {
        if (survey.timestamp > latestDate) {
          latestSurveyId = survey.id;
          latestDate = survey.timestamp;
        }
      });
      return latestSurveyId;
    },
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
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;},
      surveys: function(state) {return state.surveys;},
      user: function(state) {return state.user;}
    },
    actions: {
      hideMobileMenu: function() {store.dispatch('SET_LEFT_PANEL_VISIBILITY', false);},
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
