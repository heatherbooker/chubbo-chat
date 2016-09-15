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
            }).then(() => {
              $(document).ready(() => {
                chartService.drawCharts(this.questions);
              });
            });
      }
    }
  },
  template: `
    <div class="cc-responsesPage">
        <div
          v-for="question in questions"
          track-by="$index"
          v-if="survey.isPublished"
          :class="question.className"
          @click="viewResponse(question, $index)"
        >
          <span
            class="cc-responsesPage-close"
            @click.stop="closeResponse(question, $index)"
          >x</span>
          <div class="cc-responsesPage-responsesContainer">
            <p
              v-show="question.className === 'cc-responsesPage-block-selected' && question.responses.length < 1">
              no responses yet :(
            </p>
            <h4
              class="cc-responsesPage-responsesTitle"
              v-show="question.className === 'cc-responsesPage-block-selected' && question.responses.length > 0"
            >
              Responses
              <span>(in order they were received)</span>
            </h4>
            <ul>
              <li
                v-show="question.type === 'text' || question.className === 'cc-responsesPage-block-selected'"
                v-for="response in question.responses"
                track-by="$index"
                class="cc-responsesPage-response"
              >
                {{{ htmlPrepare(response) }}}
              </li>
            </ul>
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
            className: 'cc-responsesPage-block'
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
    viewResponse: function(clickedQuestion, clickedIndex) {
      if (clickedQuestion.className === 'cc-responsesPage-block') {
        this.questions.forEach((question, index) => {
          if (index === clickedIndex) {
            question.className = 'cc-responsesPage-block-selected';
          } else {
            question.className = 'cc-responsesPage-block-hidden';
          }
        });
        if (clickedQuestion.responses.length > 0) {
          chartService.drawLargeChart(clickedQuestion, clickedIndex);
        }
      }
    },
    closeResponse(clickedQuestion, clickedIndex) {
      this.questions.forEach(question => {
        question.className = 'cc-responsesPage-block';
      });
      chartService.drawCharts(this.questions);
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
