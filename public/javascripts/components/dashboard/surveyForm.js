window.ChubboChat.components.surveyForm = Vue.extend({
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
          v-on:click="addQuestionInput">
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
    addQuestionInput: function() {
      this.questions.push('');
      //wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        $('.cc-input-focus').focus();
      });
    },
    handlePublishButton: function() {
      if (this.isValidatedData(this.questions)) {
        this.questions = this.tidyQuestions();
        var me = this;
        this.publishSurveyToDatabase().then(function(isPublished) {
          if (isPublished) {
            me.publishSurveyToStore();
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
      return questions;
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
    publishSurveyToDatabase: function() {
      return window.ChubboChat.services.surveyApi.publishSurvey(`{
            "author": "${this.userName}",
            "surveyTitle": "${this.title}",
            "questions": "${this.questions}"
          }`)
          .then(function(response) {
            //response from 'fetch' call to firebase
            if (response.ok) {
              sweetAlert({type: 'success', title: 'Survey successfully published'});
              return true;
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
      userName: function(state) {return state.userInfo.displayName;}
    },
    actions: {
      publishSurveyToStore: function() {this.store.dispatch('publishSurvey', this.title, this.questions);}
    }
  }
});
