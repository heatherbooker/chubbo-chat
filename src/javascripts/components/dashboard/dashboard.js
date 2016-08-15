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
      this.getSurveyData('router')
          .then((surveyData) => {
            transition.next({
              title: surveyData.title,
              questions: surveyData.questions
            });
          });
    }
  },
  template: `
    <div class="cc-dashboardPage">
      <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
      </div>
      <left-panel :is-logged-in="isLoggedIn" :surveys="surveys"></left-panel>
      <span
        v-if="$loadingRouteData"
        class="fa fa-spinner fa-spin fa-5x cc-loadingIcon">
      </span>
      <div v-if="!$loadingRouteData" class="cc-dashboard-main">
        <tab-bar :is-logged-in="isLoggedIn"></tab-bar>
        <router-view :survey="survey"></router-view>
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
  data: function() {
    return {
      isLoggedIn: false,
      survey: {},
      surveys: [{title: 'a survey', isSelected: true}, {title: 'another', isSelected: false}, {title: 'A Third', isSelected: false}]
    };
  },
  methods: {
    getSurveyData: function(caller) {
      var promise = new Promise((resolve, reject) => {
        this.unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            return surveyApi.getSurveys()
                .then(response => response.json())
                .then((jsonResponse) => {
                  this.unsubscribeAuthListener();
                  var survey = this.getLatestSurvey(jsonResponse);
                  if (caller === 'router') {
                    this.title = survey.title;
                    this.questions = survey.questions;
                  }
                  resolve(survey);
                });
          } else {
            resolve({title: '', questions: ['']});
          }
        });
      });
      return promise;
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
    }
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
