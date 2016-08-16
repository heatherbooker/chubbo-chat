//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//services
import surveyApi from '../../services/surveyApi.js'
//styles
import '../../../stylesheets/responses.css'


export default Vue.extend({
  props: ['survey'],
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
          this.getQuestions(this.survey)
              .then((questions) => {
                transition.next({
                  questions
                });
                this.setResponses(this.survey);
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
      questions: [],
      arrowImgSrc: require('../../../images/arrow-right.svg'),
      arrowClass: 'cc-responsesPage-arrowIcon',
      arrowClassReveal: 'cc-responsesPage-arrowIcon-rotated'
    }
  },
  methods: {
    getQuestions: function(survey) {
      var promise = new Promise((resolve, reject) => {
        var questions = [];
        var numOfQuestions = survey.questions.length;
        for (var i = 0; i < numOfQuestions; i ++) {
          var newQuestion = {
            text: survey.questions[i],
            responses: [],
            revealResponses: false
          };
          questions.push(newQuestion);
        }
        resolve(questions);
      });
      return promise;
    },
    setResponses: function(survey) {
      if ('responses' in survey) {
        var numOfQuestions = this.questions.length;
        for (var responseKey in survey.responses) {
          for (var i = 0; i < numOfQuestions; i ++) {
            //i + 1 because 0 is the users greeting to the bot
            this.questions[i].responses.push(survey.responses[responseKey][i + 1].text)
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
