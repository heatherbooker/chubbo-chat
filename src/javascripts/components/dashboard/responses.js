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
          :class="questionClass(question)"
          @click="viewReponses(question, $index)"
        >
          <div class="cc-responsesPage-responsesContainer">
            <p
              v-show="question.type === 'text' || question.display === 'selected'"
              v-for="response in question.responses"
              track-by="$index"
              class="cc-responsesPage-response"
            >
              {{{ htmlPrepare(response) }}}
            </p>
          </div>
          <div class="cc-responsesPage-chartContainer">
            <canvas
              v-if="['slider', 'options'].indexOf(question.type) > -1"
              class="cc-responsesPage-chart"
              :id="'chart' + $index"
            ></canvas>
          </div>
          <div class="cc-responsesPage-questionBox">
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
            display: 'normal' // Possible values: null, 'normal', or 'selected'.
          };
        }));
      });
      return promise;
    },
    questionClass(question) {
      if (question.display === 'normal') {
        return 'cc-responsesPage-block';
      } else if (question.display === 'selected'){
        return 'cc-responsesPage-block-selected';
      } else {
        return 'cc-responsesPage-block-hidden';
      }
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
    viewReponses: function(clickedQuestion, clickedIndex) {
      if (clickedQuestion.responses.length < 1) {
        clickedQuestion.responses.push('no responses yet :(');
      }
      if (clickedQuestion.display === 'normal') {
        this.questions.forEach((question, index) => {
          question.display = (index === clickedIndex ? 'selected' : null);
        });
      } else if (clickedQuestion.display === 'selected') {
        this.questions.forEach(question => {
          question.display = 'normal';
        });
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
