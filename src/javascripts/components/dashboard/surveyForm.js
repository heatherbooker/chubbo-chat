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
import '../../../stylesheets/surveyForm.css'


export default Vue.extend({
  template: `
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
  `,
  components: {
    'title-input': titleInput,
    'question-input': questionInput
  },
  ready: function() {
    $('.cc-titleInput').focus();
    var me = this;
    //returns a reference to an unsubscriber
    me.unsubscribeAuthListener = firebase.auth().onAuthStateChanged(function(user) {

      if (user) {

        surveyApi.getSurveys()
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            me.populateSurveyFields(data, me);
            me.unsubscribeAuthListener();
          });

      } else if (window.localStorage.getItem('isNewlySignedIn')) {

        //user has already created survey which is saved in sessionStorage
        var savedUserSurvey = JSON.parse(window.sessionStorage.getItem('cc-userSurvey'));
        //show them their survey
        me.populateSurveyFields({isFromStorage: true, survey: savedUserSurvey}, me);
        //and publish it
        me.publishToDatabaseAndStore(me.tidyQuestions(), me);
        me.unsubscribeAuthListener();
      }
      
      //remove this for next time the page is refreshed/opened
      window.localStorage.removeItem('isNewlySignedIn');
      //clean up after ourselves
      window.sessionStorage.removeItem('cc-userSurvey');

    });
  },
  data: function() {
    return {
      title: this.title,
      questions: [''],
      titleError: false
    };
  },
  methods: {
    populateSurveyFields: function(data, me) {
      if (data.isFromStorage) {
        me.title = data.survey.title;
        me.questions = data.survey.questions.map(function(question) {
          //get rid of extra quotes
          return question.substring(1, question.length - 1);
        });
      } else {
        //find latest(most recent) survey from database
        var latestDate = 0;
        var latestSurvey;
        for (var surveyKey in data) {
          if (data[surveyKey].timestamp > latestDate) {
            latestSurvey = data[surveyKey];
            latestDate = data[surveyKey].timestamp;
          }
        }
        //populate fields with latest survey
        if (latestSurvey) {
          me.title = latestSurvey.surveyTitle;
          me.questions = latestSurvey.questions.map(function(question) {
            return question;
          });
        }
      }
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
            }).then(function(surveyId) {
              swal({
                type: 'success',
                title: 'Survey successfully published',
                html: `People can take your survey at:<br><span class="cc-copyBtn">copy</span>`,
                input: 'text',
                inputValue: `https://chubbo-chat.herokuapp.com/surveys#!/${me.user.uid}/${surveyId}`
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
      user: function(state) {return state.userInfo;}
    },
    actions: {
      publishSurveyToStore: function(store, finalQuestions) {store.dispatch('publishSurvey', this.title, finalQuestions);}
    }
  }
});
