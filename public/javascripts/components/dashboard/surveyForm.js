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
        <div class="cc-questionInputRow" v-for="question in questions">
          <input
            type="text"
            v-model=question
            class="cc-questionInput"
          >
        </div>
        <div class="cc-questionInputRow">
          <input
            type="text"
            v-model="newQuestion"
            class="cc-questionInput"
            v-on:keyup.enter="addNewQuestion"
          >
        </div>
      </div>
      <div class="cc-submitBtnContainer">
        <span class="cc-submitSurveyFormBtn">
          Publish
        </span>
      </div>
    </div>
  `,
  data: function() {
    return {
      title: this.title,
      questions: []
    };
  },
  methods: {
    addNewQuestion: function () {
      this.questions.push(this.newQuestion);
      this.newQuestion = '';
    }
  }
});
