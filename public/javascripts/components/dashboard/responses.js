window.ChubboChat.components.responsesPage = Vue.extend({
  template: `
    <div class="cc-responsesPage">
      <h1 class="cc-responsesPage-title">Reponses</h1>
      <ol class="cc-responsesPage-content">
        <li
          v-for="question in questions"
          @click="question.revealResponses ? question.revealResponses = false : question.revealResponses = true"
          class="cc-responsesPage-question"
        >
          {{question.text}}
          <ul v-show="question.revealResponses">
            <li v-for="response in question.responses">
              {{response}}
            </li>
          </ul>
        </li>
      </ol>
    </div>
  `,
  components: {
    'responses-list': window.ChubboChat.components.responsesList
  },
  ready: function() {
    // window.ChubboChat.services.surveyApi.getSurveyResponses(`zh8Ll5U6uKUkhZe34YLtuiW8X8x2`, `-KOSjDewTnvgDDi72Fqs`)
    //   .then(function(response) {
    //     console.log(response);
    //     return response.json();
    //   }).then(function(data) {
    //     console.log(data);
    //   });
  },
  data: function() {
    return {
      questions: [{
        text: 'demo?',
        responses: ['response', 'otherresponse'],
        revealResponses: false
      },
      {
        text: 'Here is the second survey question??',
        responses: ['response', 'otherresponse'],
        revealResponses: false
      },
      {
        text: 'What did you think about the third question?',
        responses: ['response', 'otherresponse'],
        revealResponses: false
      }]
    }
  },
  methods: {
    toggleResponses: function() {
      question.revealResponses = true;
    }
  }
});
