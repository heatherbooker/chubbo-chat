window.ChubboChat.components.conversation = Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages">
          <div
            v-for="message in messages"
            :class="message.sender === 'bot' ? 'cc-chatRow-bot' : 'cc-chatRow'"
          >
            <div :class="message.sender === 'bot' ? 'cc-chatBubble-bot' : 'cc-chatBubble-reply'">
              {{message.text}}
            </div>
          </div>
          <div v-if="isSurveyComplete" class="cc-chatRow-bot">
            <div class="cc-chatBubble-bot">
              Thanks for taking the survey -
              <br>
              <a class="cc-chat-createSurveyLink" href="/#!/dashboard">
                Click here to create your own survey!
              </a>
            </div>
          </div>
        </div>
        <div class="cc-chat-inputBlock">
          <input
            type="text"
            class="cc-chat-input"
            v-model="chatInput"
            @keyup.enter="handleSubmitMsg"
          >
          <span class="cc-chat-sendBtn" @click="handleSubmitMsg">
            send
          </span>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      chatInput: '',
      messages: [],
      surveyQuestions: [],
      isSurveyComplete: false
    };
  },
  ready: function() {
    $('.cc-chat-input').focus();
    var me = this;
    //get survey from database and send first message!
    this.setUpSurvey().then(function() {
      me.sendSurveyQuestion(me);
    });
  },
  methods: {
    setUpSurvey: function() {
      var me = this;
      var surveyId = this.$route.params.surveyId;
      return window.ChubboChat.services.surveyApi.getSpecificSurvey(this.$route.params.userId, surveyId)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        me.surveyQuestions = data[surveyId].questions.map(function(question) {
          return {
            text: question,
            sender: 'bot'
          };
        });
      });
    },
    handleSubmitMsg: function() {
      this.messages.push({
        text: this.chatInput,
        sender: 'user'
      });
      this.chatInput = '';
      this.sendSurveyQuestion(this);
    },
    sendSurveyQuestion: function(me) {
      if (me.messages.length <= 1) {
        //first message!
        me.messages.push({
          text: 'Hi there!',
          sender: 'bot'
        });
      } else if (me.surveyQuestions.length === 0) {
        me.isSurveyComplete = true;
      } else {
        //send a survey question
        me.messages.push(me.surveyQuestions[0]);
        me.surveyQuestions.splice(0, 1);
      }
    },
    handleNoSignUp: function() {
      this.messages.push({
        text: 'Ok, have a great day!',
        sender: 'bot'
      });
    }
  }
 });
