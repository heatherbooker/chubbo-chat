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

      this.getSurveysFromDatabase()
          .then((surveys) => {
            this.surveys = surveys;
            transition.next();
          }, () => {

            if (window.sessionStorage.getItem('cc-userSurvey')) {
              this.surveys = [this.getLocalSurvey()];
            } else {
              this.surveys = [{title: '', questions: ['']}];
            }
            transition.next();
          });
    },
    data: function(transition) {

            if (this.$route.params.title === '$creating_survey') {

              if (window.sessionStorage.getItem('cc-userSurvey')) {
                var localSurvey = this.getLocalSurvey();
                // Clean up so that if there was a local survey, it is not found
                // erroneously next time page is loaded or when user clicks 'Publish'.
                window.sessionStorage.removeItem('cc-userSurvey');
                transition.next({selectedSurvey: localSurvey});
              } else {
                transition.next({selectedSurvey: {title: '', questions: ['']}});
              }

            } else if (this.$route.params.title) {

              var title = this.$route.params.title;
              this.getSurveyByTitle(this.surveys, title)
                    .then((selectedSurvey) => {
                      transition.next({
                        selectedSurvey
                      });
                    });
            } else {

              var latestSurvey = this.getLatestSurvey(this.surveys);

              if (latestSurvey.title !== '') {
                transition.redirect(`/dashboard/surveys/${latestSurvey.title}`);
              } else {
                transition.next({selectedSurvey: {title: '', questions: ['']}});
              }
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
    document.addEventListener('cc-refreshDash', (e) => {
      this.getSurveysFromDatabase().then((surveys) => {
        this.surveys = surveys;
        this.$router.go(`/dashboard/surveys/${e.detail}`);
      });
    });
  },
  methods: {
    getSurveysFromDatabase: function() {
      var promise = new Promise((resolve, reject) => {
        this.unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            return surveyApi.getSurveys()
                .then(response => response.json())
                .then((surveys) => {
                  this.unsubscribeAuthListener();
                  resolve(this.simplifySurveyObjects(surveys));
                });
          } else {
            reject();
          }
        });
      });
      return promise;
    },
    getLocalSurvey: function() {
      var savedSurvey = JSON.parse(window.sessionStorage.getItem('cc-userSurvey'));
      var questions = savedSurvey.questions.map((question) => {
        // remove quotes
        return question.substring(1, question.length - 1);
      });
      return {
        title: savedSurvey.title,
        questions,
        isLocal: true,
        isForPublishing: savedSurvey.isForPublishing
      };
    },
    getSurveyByTitle: function(surveys, title) {
      var promise = new Promise((resolve, reject) => {
        var theSurvey = surveys.filter((survey) => {
          if (survey.title === title) {
            return survey
          }
        });
        resolve(theSurvey[0]);
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
    getLatestSurvey: function(surveys) {
      // find latest(most recent) survey from database
      var latestDate = 0;
      var latestSurvey = {title: '', questions: []};

      surveys.forEach((survey) => {
        if (survey.timestamp > latestDate) {
          latestSurvey = survey;
          latestDate = survey.timestamp;
        }
      });
      console.log('surveys', surveys);
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
