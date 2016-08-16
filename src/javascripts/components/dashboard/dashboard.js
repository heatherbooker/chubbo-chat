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
    data: function(transition) {
      this.getSurveyData()
          .then((surveyData) => {
            if (!this.$route.params.title) {
              var latestSurvey = this.getLatestSurvey(this.surveys);
              transition.redirect(`/dashboard/surveys/${latestSurvey.title}`);
            }
            else {
              var title = this.$route.params.title;
              var selectedSurvey = this.getSurveyByTitle(this.surveys, title);
              transition.next({
                surveys: surveyData,
                selectedSurvey
              });
            }
          });
      }
  },
  template: `
    <div class="cc-dashboardPage">
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
      <left-panel :is-logged-in="isLoggedIn" :surveys-prop="surveys"></left-panel>
      <div class="cc-dashboard-main">
        <tab-bar :is-logged-in="isLoggedIn"></tab-bar>
        <span
          v-if="$loadingRouteData"
          class="fa fa-spinner fa-spin fa-5x cc-loadingIcon">
        </span>
        <router-view :survey="selectedSurvey" v-if="!$loadingRouteData"></router-view>
      </div>
    </div>
  `,
  components: {
    'left-panel': leftPanel,
    'tab-bar': tabBar
  },
  data: function() {
    return {
      isLoggedIn: false,
      surveys: [],
      selectedSurvey: {}
    };
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
    // if (window.sessionStorage.getItem('cc-userSurvey')) {
    //   // User has already started / created survey which is saved in sessionStorage:
    //   // They were redirected to login after clicking either the login or publish button.
    //   // Also, unsubscribe to checking for user because we already have the survey.
    //   this.unsubscribeAuthListener();
    //   var survey = this.getLocalSurvey();
    //   // var questions = this.tidyQuestions(survey.questions);
    //   // if (survey.isForPublishing) {
    //   //   this.publishToDatabaseAndStore(survey.title, questions, this);
    //   // }
    // }

    document.addEventListener('cc-refreshDash', () => {
      this.getSurveyData()
          .then((surveyData) => {
            this.surveys = surveyData;
            // Clean up so that if there was a local survey, it is not
            // found erroneously next time page is loaded or when user clicks 'Publish'.
            window.sessionStorage.removeItem('cc-userSurvey');
          });
    });
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
    getSurveyByTitle: function(surveys, title) {
      var theSurvey = surveys.filter((survey) => {
        if (survey.title === title) {
          return survey
        }
      });
      return theSurvey[0];
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
    getLocalSurvey: function() {
      var savedSurvey = JSON.parse(window.sessionStorage.getItem('cc-userSurvey'));
      var questions = savedSurvey.questions.map((question) => {
        // remove quotes
        return question.substring(1, question.length - 1);
      });
      return [{title: savedSurvey.title, questions}];
    },
    getLatestSurvey: function(surveys) {
      // find latest(most recent) survey from database
      var latestDate = 0;
      var latestSurvey = {title: '', questions: []};

      surveys.filter((survey) => {
        if (survey.timestamp > latestDate) {
          latestSurvey = survey;
          latestDate = survey.timestamp;
        }
      });
      return {title: latestSurvey.title, questions: latestSurvey.questions};
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
