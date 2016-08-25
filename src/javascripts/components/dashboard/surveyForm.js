// libraries
import Vue from 'vue'
import swal from 'sweetalert2'
// vuex shared state store
import store from '../../store.js'
// services
import surveyService from '../../services/surveyService.js'
// components
import questionInput from './questionInput.js'
import titleInput from './titleInput.js'
// styles
import '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
import '../../../stylesheets/surveyForm.css'


export default Vue.extend({
  route: {
    data: function(transition) {
      var surveyId = this.survey.id;
      // Handles legacy naming style.
      var title = this.survey.surveyTitle || this.survey.title;
      var questions = this.survey.questions;

      // Survey was saved locally before user was redirected to login for publishing.
      if (this.survey.isForPublishing) {
        this.handleLocalSurvey(title, questions)
            .then((surveyInfo) => {
              this.alertUserSurveyPublished(surveyInfo.url);
              this.setSurveyToPublished(surveyInfo.id, surveyInfo.timestamp);
              transition.redirect(`/dashboard/surveys/${surveyInfo.id}`);
            });

      } else {
        transition.next({
          surveyId,
          title,
          questions
        });
      }
    }
  },
  template: `
    <div class="cc-surveyFormPage-container">
      <span
        v-if="$loadingRouteData"
        class="fa fa-spinner fa-spin fa-5x cc-loadingIcon"
      >
      </span>
      <div v-if="!$loadingRouteData" class="cc-surveyFormPage">
        <div class="cc-surveyFormInputs">
          <title-input
            :title.sync="title"
          >
          </title-input>
          <div
            class="cc-questionInputRow"
            v-for="question in questions"
            track-by="$index"
          >
            <question-input
              :question.sync="question"
              :index="$index"
              :max-index="this.questions.length - 1"
            >
            </question-input>
          </div>
        </div>
        <div class="cc-submitBtnContainer">
          <span
            class="cc-addQuestionInputBtn"
            v-on:click="addQuestionInput"
          >
            +
          </span>
          <span
            v-else
            class="cc-surveyForm-getLinkBtn"
            @click="handleGetLinkButton"
          >
            Get Link
          </span>
        </div>
      </div>
    </div>
  `,
  components: {
    'title-input': titleInput,
    'question-input': questionInput
  },
  data: function() {
    return {
      surveyId: '',
      title: this.title,
      questions: ['']
    };
  },
  ready: function() {
    $('.cc-titleInput').focus();
  },
  methods: {
    handleLocalSurvey(title, questions) {
      var promise = new Promise((resolve, reject) => {
        surveyService.handlePublishing(this.user, title, questions)
            .then((surveyInfo) => {
              resolve(surveyInfo);
            });
      });
      return promise;
    },
    addQuestionInput: function() {
      this.questions.push('');
      // wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        $('.cc-input-focus').focus();
      });
    },
    handleGetLinkButton: function() {
      swal({
        type: 'info',
        html: `People can take your survey at:<br><span class="cc-copyBtn">copy</span>`,
        input: 'text',
        inputValue: this.surveyUrl
      });
      this.makeInputTextCopyable();
    },
    alertUserSurveyPublished: function(surveyUrl) {
      swal({
        type: 'success',
        title: 'Survey successfully published',
        html: `People can take your survey at:<br><span class="cc-copyBtn">copy</span>`,
        input: 'text',
        inputValue: surveyUrl
      });
      this.makeInputTextCopyable();
    },
    makeInputTextCopyable: function() {
      var isTextSelected = false;
      // select and unselect all input text on click
      $('.swal2-input').click(function() {
        if (isTextSelected) {
          isTextSelected = false;
        } else {
          $(this).select();
          isTextSelected = true;
        }
      });
      // copy input text to users clipboard
      $('.cc-copyBtn').click(function() {
        $('.swal2-input').select();
        document.execCommand('copy');
      });
    },

  },
  // Events sent up from child components (title / question inputs)
  events: {
    enterKeyPressed: function() {
      this.addQuestionInput();
    },
    deleteQuestion: function(index) {
      this.questions.splice(index, 1);
    }
  },
  // vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      user: function(state) {return state.user;},
      userId: function(state) {return state.user.uid;},
      survey: function(state) {return state.selectedSurvey;},
    },
    actions: {
      setUser: function(state, user) {store.dispatch('SET_USER', user);},
      setSurveyToPublished(state, surveyId, timestamp) {
        store.dispatch('PUBLISH_SURVEY', surveyId, timestamp);
      }
    }
  }
});
