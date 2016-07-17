window.ChubboChat.components.surveyForm = Vue.extend({
  template: `
    <div class="col-md-9 col-xs-12">
      <div class="row">
        <div class="col-md-11 col-md-offset-1">
          <div class="cc-surveyFormPage">
            <input
              type="text"
              v-model="title"
              class="cc-titleInput"
              placeholder="Title..."
            >
            <div class="cc-surveyFormList">
              <div><input type="text" v-model="question1" class="cc-questionInput"></div>
              <div><input type="text" v-model="question2" class="cc-questionInput"></div>
              <div><input type="text" v-model="question3" class="cc-questionInput"></div>
              <div><input type="text" v-model="question4" class="cc-questionInput"></div>
              <div>
                <input type="text" v-model="question5" class="cc-questionInput cc-lastQuestion">
                <span class="cc-submitSurveyFormBtn">
                  Publish
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});
