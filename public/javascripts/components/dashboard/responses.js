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
