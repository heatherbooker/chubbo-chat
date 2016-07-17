window.ChubboChat.components.surveyForm = Vue.extend({
  template: `
    <div class="col-md-9">
      <div class="row">
        <div class="col-md-8 col-md-offset-1">
          <div class="cc-surveyForm">
            <input
              type="text"
              v-model="title"
              class="cc-titleInput"
              placeholder="Title..."
            >
            <ol class="cc-surveyFormList">
              <li><input type="text" v-model="question1" class="cc-questionInput"></li>
              <li><input type="text" v-model="question2" class="cc-questionInput"></li>
              <li><input type="text" v-model="question3" class="cc-questionInput"></li>
              <li><input type="text" v-model="question4" class="cc-questionInput"></li>
              <li><input type="text" v-model="question5" class="cc-questionInput"></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
    };
  }
});
