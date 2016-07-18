window.ChubboChat.components.surveyForm = Vue.extend({
  template: `
    <div class="cc-surveyFormPage">
      <div class="cc-surveyFormInputs">
        <div class="cc-inputRow">
          <input
            type="text"
            v-model="title"
            class="cc-titleInput"
            placeholder="Title..."
          >
        </div>
        <div class="cc-inputRow">
          <span class="cc-questionNumber">1.</span>
          <input type="text" v-model="question1" class="cc-questionInput">
        </div>
        <div class="cc-inputRow">
          <span class="cc-questionNumber">2.</span>
          <input type="text" v-model="question2" class="cc-questionInput">
        </div>
        <div class="cc-inputRow">
          <span class="cc-questionNumber">3.</span>
          <input type="text" v-model="question3" class="cc-questionInput">
        </div>
        <div class="cc-inputRow">
          <span class="cc-questionNumber">4.</span>
          <input type="text" v-model="question4" class="cc-questionInput">
        </div>
        <div class="cc-inputRow">
          <span class="cc-questionNumber">5.</span>
          <input type="text" v-model="question5" class="cc-questionInput">
        </div>
        <div class="cc-inputRow">
          <span class="cc-questionNumber">5.</span>
          <input type="text" v-model="question5" class="cc-questionInput">
        </div>
      </div>
      <div class="cc-submitBtnContainer">
        <span class="cc-submitSurveyFormBtn">
          Publish
        </span>
      </div>
    </div>
  `
});
