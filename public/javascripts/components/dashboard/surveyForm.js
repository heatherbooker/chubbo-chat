window.ChubboChat.components.surveyForm = Vue.extend({
  template: `
    <div class="cc-surveyFormPage">
      <div class="cc-surveyFormInputs">
        <title-input
          :title.sync="title"
          :styles="titleError ? errorStyles : {}"
        >
        </title-input>
        <div
          class="cc-questionInputRow"
          v-for="question in questions"
          track-by="$index"
        >
          <question-input :question.sync="question" :index="$index" :max-index="numOfQuestions - 1"></question-input>
        </div>
      </div>
      <div class="cc-submitBtnContainer">
        <span
          class="cc-submitSurveyFormBtn"
          v-on:click="publishSurvey"
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
      errorStyles: {
        border: '1px solid #a94442',
        borderRadius: '20px',
        paddingLeft: '8px',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075),0 0 6px #ce8483'
      },
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  computed: {
    numOfQuestions: function() {
      return this.questions.length;
    }
  },
  methods: {
    deleteQuestion: function(index) {
      this.questions.splice(index, 1);
    },
    publishSurvey: function() {
      this.validateData(this.questions);
      console.log('title: ', this.title, '; questions: ', this.questions);
    },
    validateData: function(questions) {
      if (!this.title) {
        sweetAlert({
          title: 'Please add a title.',
          type: 'warning',
          allowEscapeKey: true,
          allowOutsideClick: true
        }, function() {
          $('.cc-titleInput').focus();
        });
        //scroll up to title input and make it stand out
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.titleError = true;
      } else {
        this.titleError = false;
        //unless there's only one question,
        if (this.questions[0] !== '' && this.numOfQuestions !== 1) {
          //remove blank questions
          for (var i = 0; i < this.numOfQuestions; i++) {
            if (this.questions[i] === '') {
              this.deleteQuestion(i);
            }
          }
        }
      }
    }
  },
  events: {
    enterKeyPressed: function() {
      this.questions.push('');
      //wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        document.getElementById('cc-input-focus').focus();
      });
    },
    deleteQuestion: function(index) {
      this.deleteQuestion(index);
    }
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    actions: {
      createSurvey: function() {this.store.dispatch('createSurvey', this.title, this.questions);}
    }
  }
});
