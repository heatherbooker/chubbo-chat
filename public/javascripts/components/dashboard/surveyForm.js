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
        <span class="cc-submitSurveyFormBtn">
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
      questions: ['']
    };
  },
  computed: {
    numOfQuestions: function() {
      return this.questions.length;
    }
  },
  events: {
    enterKeyPressed: function() {
      this.questions.push('');
      //wait for new input to be inserted before moving focus to it
      this.$nextTick(function() {
        document.getElementById('cc-input-focus').focus();
      });
    }
  }
});
