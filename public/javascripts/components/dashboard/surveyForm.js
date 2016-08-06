window.ChubboChat.components.surveyForm = Vue.extend({
  template: `
    <div class="cc-surveyFormPage">
      <ring-loader :loading="loading" :color="#3c5a71">
      </ring-loader>
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
    'title-input': window.ChubboChat.components.titleInput,
    'question-input': window.ChubboChat.components.questionInput
  },
  ready: function() {
    $('.cc-titleInput').focus();
    var me = this;
    //returns a reference to an unsubscriber
    me.unsubscribeAuthListener = firebase.auth().onAuthStateChanged(function(user) {
      if (user && !this.title) {
        window.ChubboChat.services.surveyApi.getSurveys()
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            me.populateSurveyFields(data, me);
            me.unsubscribeAuthListener();
          });
        }
    });
  },
  data: function() {
    return {
      title: this.title,
      questions: [''],
      titleError: false,
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  methods: {
    populateSurveyFields: function(data, me) {
      //find latest(most recent) survey
      var latestDate = 0;
      var latestSurvey;
      for (surveyKey in data) {
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
            window.ChubboChat.services.login.signIn();
          });
        }
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
    publishSurveyToDatabase: function(finalQuestions) {
      var me = this;
      return window.ChubboChat.services.surveyApi.publishSurvey(`{
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
      publishSurveyToStore: function(store, finalQuestions) {this.store.dispatch('publishSurvey', this.title, finalQuestions);}
    }
  }
});
