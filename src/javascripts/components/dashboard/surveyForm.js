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
  props: ['surveys'],
  template: `
    <div class="cc-surveyFormPage-container">
      <div class="cc-surveyFormPage">
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
  ready: function() {
    $('.cc-titleInput').focus();
    
    // Listen for user logging in so we can save their half-written survey.
    document.addEventListener('cc-saveSurveyState', () => {
      // Last arg is false to indicate this survey should not be published.
      this.setLocalSurvey(this.title, this.tidyQuestions(this.questions), false);
    });
  },
  data: function() {
    return {
      title: this.surveys[0].title,
      questions: this.surveys[0].questions,
      titleError: false
    };
  },
  methods: {
    updateData: function() {
      return this.getSurveyData().then((survey) => {
        this.title = survey.title;
        this.questions = survey.questions;
      })
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
    },
    addQuestionInput: function() {
      this.questions.push('');
      // wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        $('.cc-input-focus').focus();
      });
    },
    handlePublishButton: function() {
      var me = this;
      // Make sure we are not still looking for a user to populate survey fields with past data.
      //this.unsubscribeAuthListener();
      if (this.isValidatedData(this.title, this.questions)) {
        var finalQuestions = this.tidyQuestions(this.questions);
        if (!firebase.auth().currentUser) {
          swal({
            type: 'warning',
            title: 'Please log in to save your survey!',
            showCancelButton: true
          }).then(function() {
            // Mobile users are redirected to login, so we need to save their survey first.
            this.setLocalSurvey(this.title, finalQuestions, true);
            window.ChubboChat.services.login.signIn().then(function() {
              me.publishToDatabaseAndStore(this.title, finalQuestions, me);
            });
          });
        } else {
          me.publishToDatabaseAndStore(this.title, finalQuestions, me);
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
      // on mobile: the login service refreshes the page, so we need to save survey data
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
      var published = false;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user && !published) {
          me.publishSurveyToDatabase(title, finalQuestions).then(function(isPublished) {
            if (isPublished) {
              me.publishSurveyToStore(title, finalQuestions);
              published = true;
              // Clean up so that if there was a local survey, it is not
              // found erroneously next time page is loaded.
              window.sessionStorage.removeItem('cc-userSurvey');
            }
          });
        }
      });
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
                })
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
