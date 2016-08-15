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
      this.getSurveyData()
          .then((surveyData) => {
            transition.next({
              surveys: surveyData
            });
          });
    },
    data: function(transition) {
      transition.next();
      this.getSurveyData()
          .then((surveyData) => {
            this.surveys = surveyData;
          })
    }
  },
  template: `
    <div class="cc-dashboardPage">
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
      <left-panel :is-logged-in="isLoggedIn" :surveys="surveys"></left-panel>
      <div class="cc-dashboard-main">
        <tab-bar :is-logged-in="isLoggedIn"></tab-bar>
        <span
          v-if="$loadingRouteData"
          class="fa fa-spinner fa-spin fa-5x cc-loadingIcon">
        </span>
        <router-view :surveys="surveys" v-if="!$loadingRouteData"></router-view>
      </div>
    </div>
  `,
  components: {
    'left-panel': leftPanel,
    'tab-bar': tabBar
  },
  created: function() {
    this.hideMenuMobile();
    this.createNewSurvey();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  },
  ready: function() {
    if (window.sessionStorage.getItem('cc-userSurvey')) {
      // User has already started / created survey which is saved in sessionStorage:
      // They were redirected to login after clicking either the login or publish button.
      // Also, unsubscribe to checking for user because we already have the survey.
      this.unsubscribeAuthListener();
      var survey = this.getLocalSurvey();
      var questions = this.tidyQuestions(survey.questions);
      if (survey.isForPublishing) {
        this.publishToDatabaseAndStore(survey.title, questions, this);
      }
    }

    document.addEventListener('cc-refreshDash', () => {
      this.updateData()
          .then(() => {
              // Clean up so that if there was a local survey, it is not
              // found erroneously next time page is loaded or when user clicks 'Publish'.
              window.sessionStorage.removeItem('cc-userSurvey');
          });
    });
  },
  data: function() {
    return {
      isLoggedIn: false,
      surveys: []
    };
  },
  methods: {
    getSurveyData: function(caller) {
      var promise = new Promise((resolve, reject) => {
        if (window.sessionStorage.getItem('cc-userSurvey')) {
          // User has already created survey which is saved in sessionStorage
          resolve([this.getLocalSurvey()]);
        }
        this.unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            return surveyApi.getSurveys()
                .then(response => response.json())
                .then((surveys) => {
                  this.unsubscribeAuthListener();
                  resolve(this.simplifySurveyObjects(surveys));
                });
          } else {
            resolve([{title: '', questions: ['']}]);
          }
        });
      });
      return promise;
    },
    simplifySurveyObjects: function(surveysJson) {
      var simpleSurveys = [];
      for (var surveyKey in surveysJson) {
        var survey = surveysJson[surveyKey];
        simpleSurveys.push({
          title: survey.surveyTitle,
          questions: survey.questions,
          responses: survey.responses,
          timestamp: survey.timestamp
        });
      }
      this.surveys = simpleSurveys;
      return simpleSurveys;
    },
    getLatestSurvey: function(data) {
      // find latest(most recent) survey from database
      var latestDate = 0;
      var latestSurvey = {title: '', questions: []};

      for (var surveyKey in data) {
        if (data[surveyKey].timestamp > latestDate) {
          latestSurvey = data[surveyKey];
          latestDate = data[surveyKey].timestamp;
        }
      }
      return {title: latestSurvey.surveyTitle, questions: latestSurvey.questions};
    },
    getLocalSurvey: function() {
      var savedSurvey = JSON.parse(window.sessionStorage.getItem('cc-userSurvey'));
      var questions = savedSurvey.questions.map((question) => {
        // remove quotes
        return question.substring(1, question.length - 1);
      });
      return [{title: savedSurvey.title, questions}];
    },
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;}
    },
    actions: {
      hideMenuMobile: function() {store.dispatch('toggleLeftPanel', false);},
      createNewSurvey: function() {store.dispatch('startDraft');}
    }
  }
});
