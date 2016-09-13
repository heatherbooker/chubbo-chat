//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//services
import surveyApi from '../../services/surveyApi.js'
// Components
import responseBlock from './responseBlock.js';
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
            });
      }
    }
  },
  template: `
    <div class="cc-responsesPage" v-if="!$loadingRouteData">
      <div class="cc-responsesPage-container">
        <div
          v-for="question in questions"
          track-by="$index"
          v-if="survey.isPublished"
        >
          <div class="cc-responsesPage-questionRow" @click="toggleViewReponses(question)">
            <p class="cc-responsesPage-question">
              <img
                :src="arrowImgSrc"
                :class="question.revealResponses ? arrowClassReveal : arrowClass"
              />
              {{ question.text }}
            </p>
          </div>
          <response-block
            :survey="survey"
            :question="question"
            :question-index="$index"
          ></response-block>
        </div>
        <p v-if="!survey.isPublished" class="cc-responsesPage-errorNotice">
          Publish your current survey or <br> select a published survey to see responses!
        </p>
      </div>
    </div>
  `,
  components: {
    'response-block': responseBlock
  },
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
            text: question.text,
            responses: [],
            revealResponses: false
          };
        }));
      });
      return promise;
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
