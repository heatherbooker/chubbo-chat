//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//services
import surveyApi from '../../services/surveyApi.js'
//styles
import '../../../stylesheets/responses.css'


export default Vue.extend({
  route: {
    canActivate: function(transition) {
      // We need to access the store directly; 'this.user' won't work
      // because the component hasn't been created yet!
      if (store.state.user) {
        transition.next();
      } else {
        transition.abort();
      }
    },
    data: function(transition) {
      if (this.user) {
        this.getQuestions(this.survey)
            .then((questions) => {
              this.questions = questions;
              transition.next();
              this.setResponses(this.survey);
            });
      }
    }
  },
  template: `
    <div class="cc-responsesPage">
      <div class="cc-responsesPage-container">
        <div
          v-for="question in questions"
          track-by="$index"
          v-if="survey.isPublished"
        >
          <div class="cc-responsesPage-questionRow" @click="toggleViewReponses(question)">
            <img
              :src="arrowImgSrc"
              :class="question.revealResponses ? arrowClassReveal : arrowClass"
            />
            <p class="cc-responsesPage-question">{{ question.text }}</p>
          </div>
          <p
            v-for="response in question.responses"
            track-by="$index"
            v-show="question.revealResponses"
            class="cc-responsesPage-response"
          >
            {{ response }}
          </p>
        </div>
        <p v-if="!survey.isPublished" class="cc-responsesPage-errorNotice">
          Publish your current survey or <br> select a published survey to see responses!
        </p>
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
        resolve(survey.questions.map((question) => {
          return {
            text: question,
            responses: [],
            revealResponses: false
          };
        }));
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
  },
  // vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      survey: function(state) {return state.selectedSurvey;},
      user: function(state) {return state.user}
    }
  }
});
