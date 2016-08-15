//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//services
import surveyApi from '../../services/surveyApi.js'
//styles
import '../../../stylesheets/responses.css'


export default Vue.extend({
  props: ['surveys'],
  route: {
    canActivate: function(transition) {
      var unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          transition.next();
          unsubscribeAuthListener();
        } else {
          transition.abort();
        }
      })
    },
    data: function(transition) {
      var unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.getQuestions(this.surveys)
              .then((questions) => {
                transition.next({
                  latestSurvey: this.surveys[0],
                  questions
                });
                this.setResponses(this.surveys);
                unsubscribeAuthListener();
              });
        }
      });
    }
  },
  template: `
    <div class="cc-responsesPage">
      <div class="cc-responsesPage-container">
        <div v-for="question in questions">
          <div class="cc-responsesPage-questionRow" @click="toggleViewReponses(question)">
            <img
              :src="arrowImgSrc"
              :class="question.revealResponses ? arrowClassReveal : arrowClass"
            />
            <p class="cc-responsesPage-question">{{ question.text }}</p>
          </div>
          <p
            v-show="question.revealResponses"
            v-for="response in question.responses"
            track-by="$index"
            class="cc-responsesPage-response"
          >
            {{ response }}
          </p>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      latestSurvey: {},
      questions: [],
      arrowImgSrc: require('../../../images/arrow-right.svg'),
      arrowClass: 'cc-responsesPage-arrowIcon',
      arrowClassReveal: 'cc-responsesPage-arrowIcon-rotated'
    }
  },
  methods: {
    getQuestions: function(data) {
      //find latest(most recent) survey from database
      var latestDate = 0;
      var latestSurvey;
      for (var surveyKey in data) {
        if (data[surveyKey].timestamp > latestDate) {
          latestSurvey = data[surveyKey];
          latestDate = data[surveyKey].timestamp;
        }
      }
      //store it for the setResponses method
      this.latestSurvey = latestSurvey;

      var promise = new Promise((resolve, reject) => {
        var questions = [];
        var numOfQuestions = latestSurvey.questions.length;
        for (var i = 0; i < numOfQuestions; i ++) {
          var newQuestion = {
            text: latestSurvey.questions[i],
            responses: [],
            revealResponses: false
          };
          questions.push(newQuestion);
        }
        resolve(questions);
      });
      return promise;
    },
    setResponses: function(data) {
      if ('responses' in this.latestSurvey) {
        var numOfQuestions = this.questions.length;
        for (var responseKey in this.latestSurvey.responses) {
          for (var i = 0; i < numOfQuestions; i ++) {
            //i + 1 because 0 is the users greeting to the bot
            this.questions[i].responses.push(this.latestSurvey.responses[responseKey][i + 1].text)
          }
        }
      }
    },
    toggleViewReponses: function(question) {
      if (question.responses.length < 1) {
        question.responses.push('no responses yet :(');
      }
      if (question.revealResponses === true) {
        question.revealResponses = false;
      } else {
        question.revealResponses = true;
      }
    }
  }
});
