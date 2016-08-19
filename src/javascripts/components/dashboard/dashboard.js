//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
// services
import surveyApi from '../../services/surveyApi.js'
//components
import leftPanel from './leftPanel.js'
import tabBar from './tabBar.js'
//styles
import '../../../stylesheets/dashboard.css'


export default Vue.extend({
  route: {
    activate: function(transition) {
      this.getPublishedSurveys()
          .then((surveys) => {
            for (var surveyKey in surveys) {
              var survey = surveys[surveyKey];
              survey.id = surveyKey;
              survey.isPublished = true;
              this.addSurveyToStore(survey);
            }
            transition.next();
          }, () => {
            transition.next();
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
        this.setSelectedSurvey(localSurvey, '$creating_survey');
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
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
      <left-panel :is-logged-in="isLoggedIn" :surveys="surveys"></left-panel>
      <div class="cc-dashboard-main">
        <tab-bar v-if="isLoggedIn"></tab-bar>
        <span
          v-if="$loadingRouteData"
          class="fa fa-spinner fa-spin fa-5x cc-loadingIcon">
        </span>
        <router-view v-if="!$loadingRouteData"></router-view>
      </div>
    </div>
  `,
  components: {
    'left-panel': leftPanel,
    'tab-bar': tabBar
  },
  data: function() {
    return {
      isLoggedIn: false
    };
  },
  created: function() {
    this.hideMobileMenu();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  },
  methods: {
    getPublishedSurveys: function() {
      var promise = new Promise((resolve, reject) => {
        this.unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            return surveyApi.getSurveys()
                .then(response => response.json())
                .then((surveys) => {
                  this.unsubscribeAuthListener();
                  resolve(surveys);
                });
          } else {
            reject();
          }
        });
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
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;},
      surveys: function(state) {return state.surveys;}
    },
    actions: {
      hideMobileMenu: function() {store.dispatch('toggleLeftPanel', false);},
      addSurveyToStore: function(store, survey) {
        store.dispatch('ADD_SURVEY', survey);
      },
      setSelectedSurvey: function(store, survey) {
        store.dispatch('setSelectedSurvey', survey);
      }
    }
  }
});
