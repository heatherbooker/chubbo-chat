// libraries
import Vue from 'vue'
import swal from 'sweetalert2'
// vuex shared state store
import store from '../../store.js'
// services
import surveyApi from '../../services/surveyApi.js'
// components
import questionInput from './questionInput.js'
import titleInput from './titleInput.js'
// styles
import '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
import '../../../stylesheets/surveyForm.css'


export default Vue.extend({
  props: ['survey'],
  route: {
    data: function(transition) {
      var title = this.survey.title;
      var questions = this.survey.questions;

      if (this.survey.isForPublishing) {
        var finalQuestions = this.tidyQuestions(questions);
        this.publishToDatabaseAndStore(title, finalQuestions, this)
            .then(() => {
              transition.next({
                title,
                questions
              });
            });
      } else {
        transition.next({
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
          class="fa fa-spinner fa-spin fa-5x cc-loadingIcon">
        </span>
      <div v-if="!$loadingRouteData" class="cc-surveyFormPage">
        <div class="cc-surveyFormInputs">
          <title-input
            :title.sync="title"
            :error-status="titleError"
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
            class="cc-submitSurveyFormBtn"
            v-on:click="handlePublishButton"
          >
            Publish
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
      title: '',
      questions: [''],
      titleError: false
    };
  },
  ready: function() {
    $('.cc-titleInput').focus();
    // Listen for user logging in so we can save their half-written survey before redirect.
    document.addEventListener('cc-saveSurveyState', () => {
      // Last arg is false to indicate this survey should not be published.
      this.setLocalSurvey(this.title, this.tidyQuestions(this.questions), false);
    });
  },
  methods: {
    addQuestionInput: function() {
      this.questions.push('');
      // wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        $('.cc-input-focus').focus();
      });
    },
    handlePublishButton: function() {
      var me = this;
      if (this.isValidatedData(this.title, this.questions)) {
        var finalQuestions = this.tidyQuestions(this.questions);
        if (!firebase.auth().currentUser) {
          swal({
            type: 'warning',
            title: 'Please log in to save your survey!',
            showCancelButton: true
          }).then(function() {
            // Users are redirected to login, so we need to save their survey first.
            me.setLocalSurvey(me.title, finalQuestions, true);
            window.ChubboChat.services.login.signIn()
          });
        } else {
          me.publishToDatabaseAndStore(me.title, finalQuestions, me).then(() => {
            // Dashboard component is listening to this event, to refresh
            // left panel list of surveys and URL.
            document.dispatchEvent(new CustomEvent('cc-refreshDash', {'detail': me.title}));
          });
        }
      }
    },
    setLocalSurvey: function(title, questions, isForPublishing) {
      // isForPublishing will be true if user clicked 'Publish' button;
      // else, they just logged in while in the middle of creating a survey.
      var surveyObject = {
        title,
        questions,
        isForPublishing
      };
      window.sessionStorage.setItem('cc-userSurvey', JSON.stringify(surveyObject));
    },
    tidyQuestions: function(questions) {
      var filteredQuestions = questions;
      // unless there's only one question,
      if (questions.length > 1) {
        // remove blank questions
        filteredQuestions = questions.filter(function(question) {
          return question !== '';
        });
      }
      // Adding quotes to make it valid json for sending to database
      var finalQuestions = filteredQuestions.map(function(question) {
        return `"${question}"`;
      });

      return finalQuestions;
    },
    isValidatedData: function(title, questions) {
      if (!title) {
        $('.cc-titleInput').focus();
        // scroll up to title input and make it stand out
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.titleError = true;
        return false;
      } else {
        this.titleError = false;
        return true;
      }
      // We don't have any validity checks for the questions
    },
    publishToDatabaseAndStore: function(title, finalQuestions, me) {
      var promise = new Promise((resolve, reject) => {
        var published = false;
        var unsubscribeAuthListener = firebase.auth().onAuthStateChanged(function(user) {
          if (user && !published) {
             me.publishSurveyToDatabase(title, finalQuestions).then(function(isPublished) {
              if (isPublished) {
                unsubscribeAuthListener();
                // Clean up so that if there was a local survey, it is not
                // found erroneously next time page is loaded.
                window.sessionStorage.removeItem('cc-userSurvey');
                me.publishSurveyToStore(title, finalQuestions);
                published = true;
                resolve();
              }
            });
          }
        });
      });
      return promise;
    },
    publishSurveyToDatabase: function(title, finalQuestions) {
      var me = this;
      return surveyApi.publishSurvey(`{
        "surveyTitle": "${title}",
        "questions": [${finalQuestions}],
        "timestamp": "${Date.now()}"
      }`)
          .then(function(response) {
            if (response.ok) {
              return response.json()
                .then(function(responseData) {
                  // 'responseData.name' is the ID generated by the POST request through surveyApi.
                  return responseData.name;
                })
                .then(function(surveyId) {
                  swal({
                    type: 'success',
                    title: 'Survey successfully published',
                    html: `People can take your survey at:<br><span class="cc-copyBtn">copy</span>`,
                    input: 'text',
                    inputValue: `https://chubbo-chat.herokuapp.com/#!/surveys/${me.userId}/${surveyId}`
                  });
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
                  return true;
                });
            } else {
              console.log('error: ', response.statusText);
              return false;
            }
          });
    }
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
      userId: function(state) {
        return state.userInfo.uid;
      }
    },
    actions: {
      publishSurveyToStore: function(store, title, finalQuestions) {
        store.dispatch('publishSurvey', title, finalQuestions);
      }
    }
  }
});
