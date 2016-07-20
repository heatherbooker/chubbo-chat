window.ChubboChat.components.surveyForm = Vue.extend({
  template: `
    <div class="cc-surveyFormPage">
      <div class="cc-surveyFormInputs">
        <div class="cc-titleInputRow">
          <input
            type="text"
            v-model="title"
            class="cc-titleInput"
            placeholder="Title..."
          >
        </div>
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
    'question-input': window.ChubboChat.components.questionInput
  },
  data: function() {
    return {
      title: this.title,
      questions: [''],
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
      //handle lack of data
      if (questions[0] === '' && questions.length === 1) {
        if (!this.title) {
          alert('You have not entered a title or any questions!');
        }
      } else {
        if (!this.title) {
          this.title = 'My Survey';
        }
        //remove blank questions
        for (var i = 0; i < this.numOfQuestions; i++) {
          if (this.questions[i] === '') {
            this.deleteQuestion(i);
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
