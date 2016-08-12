//libraries
import Vue from 'vue'
import swal from 'sweetalert2'
//vuex shared state store
import store from '../../store.js'
//services
import surveyApi from '../../services/surveyApi.js'
//components
import questionInput from './questionInput.js'
import titleInput from './titleInput.js'
//styles
import '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
import '../../../stylesheets/surveyForm.css'


export default Vue.extend({
  route: {
    data: function(transition) {
      this.getSurveyData('router')
          .then((surveyData) => {
            transition.next({
              title: surveyData.title,
              questions: surveyData.questions
            });
          });
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
  ready: function() {
    $('.cc-titleInput').focus();

    if (window.sessionStorage.getItem('cc-userSurvey')) {
      //user has already created survey which is saved in sessionStorage
      //they just logged in to publish it, so let's do that
      new Promise((resolve, reject) => {
        resolve(this.getLocalSurvey())
      }).then((localSurvey) => {
        this.title = localSurvey.title;
        this.questions = localSurvey.questions;
      }).then(() => {
        (this.publishToDatabaseAndStore(this.tidyQuestions(), this));
      });
    }

    //listen for user logging in
    document.addEventListener('cc-refreshDash', () => {
      this.updateData();
    })
  },
  data: function() {
    return {
      title: this.title,
      questions: [''],
      titleError: false
    };
  },
  methods: {
    updateData: function() {
      this.getSurveyData().then((survey) => {
        this.title = survey.title;
        this.questions = survey.questions;
      })
    },
    getSurveyData: function(caller) {
      var promise = new Promise((resolve, reject) => {
        if (window.sessionStorage.getItem('cc-userSurvey')) {
          //user has already created survey which is saved in sessionStorage
          resolve(this.getLocalSurvey());
        }
        this.unsubscribeAuthListener = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            return surveyApi.getSurveys()
                .then(response => response.json())
                .then((jsonResponse) => {
                  this.unsubscribeAuthListener();
                  var surevy = this.getLatestSurvey(jsonResponse);
                  if (caller === 'router') {
                    this.title = surevy.title;
                    this.questions = surevy.questions;
                  }
                  resolve(surevy);
                });
          } else {
            resolve({title: '', questions: ['']});
          }
        });
      });
      return promise;
    },
    getLocalSurvey: function() {
      //user has already created survey which is saved in sessionStorage
      var savedSurvey = JSON.parse(window.sessionStorage.getItem('cc-userSurvey'));
      var questions = savedSurvey.questions.map((question) => {
        //remove quotes
        return question.substring(1, question.length - 1);
      });

      return {title: savedSurvey.title, questions};
    },
    getLatestSurvey: function(data) {
      //find latest(most recent) survey from database
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
      //wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        $('.cc-input-focus').focus();
      });
    },
    handlePublishButton: function() {
      //make sure we are not still looking for a user to populate survey fields with past data
      this.unsubscribeAuthListener();
      if (this.isValidatedData(this.questions)) {
        var finalQuestions = this.tidyQuestions();
        var me = this;
        if (!firebase.auth().currentUser) {
          swal({
            type: 'warning',
            title: 'Please log in to save your survey!',
            showCancelButton: true
          }).then(function() {
            var surveyObject = {
              title: me.title,
              questions: finalQuestions
            };
            //on mobile: the login service refreshes the page, so we need to save survey data
            window.sessionStorage.setItem('cc-userSurvey', JSON.stringify(surveyObject));
            window.ChubboChat.services.login.signIn().then(function() {
              //need this line if page redirects
              window.localStorage.setItem('isNewlySignedIn', true);
              //need this line if it doesn't
              me.publishToDatabaseAndStore(finalQuestions, me);
            });
          });
        } else {
          me.publishToDatabaseAndStore(finalQuestions, me);
        }
      }
    },
    tidyQuestions: function() {
      var questions = this.questions;
      //unless there's only one question,
      if (this.questions.length > 1) {
        //remove blank questions
        questions = this.questions.filter(function(question) {
          return question !== '';
        });
      }
      //make valid json
      var finalQuestions = questions.map(function(question) {
        return `"${question}"`;
      });

      return finalQuestions;
    },
    isValidatedData: function() {
      if (!this.title) {
        $('.cc-titleInput').focus();
        //scroll up to title input and make it stand out
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.titleError = true;
        return false;
      } else {
        this.titleError = false;
        return true;
      }
    },
    publishToDatabaseAndStore: function(finalQuestions, me) {
      var published = false;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user && !published) {
          me.publishSurveyToDatabase(finalQuestions).then(function(isPublished) {
            if (isPublished) {
              me.publishSurveyToStore(finalQuestions);
              published = true;
              //clean up
              window.localStorage.removeItem('isNewlySignedIn');
              window.sessionStorage.removeItem('cc-userSurvey');
            }
          });
        }
      });
    },
    publishSurveyToDatabase: function(finalQuestions) {
      var me = this;
      return surveyApi.publishSurvey(`{
        "surveyTitle": "${this.title}",
        "questions": [${finalQuestions}],
        "timestamp": "${Date.now()}"
      }`)
          .then(function(response) {
            //response from 'fetch' call to firebase
            if (response.ok) {
              return response.json()
                .then(function(responseData) {
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
                  //select and unselect all input text on click
                  $('.swal2-input').click(function() {
                    if (isTextSelected) {
                      isTextSelected = false;
                    } else {
                      $(this).select();
                      isTextSelected = true;
                    }
                  });
                  //copy input text to users clipboard
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
  events: {
    enterKeyPressed: function() {
      this.addQuestionInput();
    },
    deleteQuestion: function(index) {
      this.questions.splice(index, 1);
    }
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      userId: function(state) {
        return state.userInfo.uid;
      }
    },
    actions: {
      publishSurveyToStore: function(store, finalQuestions) {
        store.dispatch('publishSurvey', this.title, finalQuestions);
      }
    }
  }
});