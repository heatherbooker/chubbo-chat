//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//services
import surveyApi from '../../services/surveyApi.js'
import htmlService from '../../services/htmlService.js';
import chartService from '../../services/chartService.js';
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
            }).then(() => {chartService(this.questions);});
      }
    }
  },
  template: `
    <div class="cc-responsesPage">
        <div
          v-for="question in questions"
          track-by="$index"
          v-if="survey.isPublished"
          class="cc-responsesPage-block"
        >
          <p
            v-if="question.type === 'text'"
            v-for="response in question.responses"
            track-by="$index"
            v-show="question.revealResponses"
            class="cc-responsesPage-response"
          >
            {{{ htmlPrepare(response) }}}
          </p>
          <canvas
            v-if="['slider', 'options'].indexOf(question.type) > -1"
            class="cc-responsesPage-chart"
            :id="'chart' + $index"
          ></canvas>
          <div class="cc-responsesPage-questionBox" @click="toggleViewReponses(question)">
            <p class="cc-responsesPage-question">{{{ htmlPrepare(question.text) }}}</p>
          </div>
        </div>
        <p v-if="!survey.isPublished" class="cc-responsesPage-errorNotice">
          Publish your current survey or <br> select a published survey to see responses!
        </p>
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
            ...question,
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
            this.questions[i].responses.push(survey.responses[responseKey][i].response);
          }
        }
      }
    },
    htmlPrepare(text) {
      return htmlService(text);
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
