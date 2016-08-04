window.ChubboChat.components.conversation = Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages">
          <message-bubble
            v-for="message in messages"
            :message="message"
          >
          </message-bubble>
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
  components: {
    'message-bubble': window.ChubboChat.components.messageBubble
  },
  data: function() {
    return {
      chatInput: '',
      messages: [],
      surveyQuestions: [],
      botMessages: {
        hello: 'Hi there!',
        goodbye: `Thanks for taking the survey! Visit
          chubbo-chat.herokuapp.com/#!/dashboard to create your own survey!`
      },
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
    //scroll to bottom of messages div whenever something is added
    window.ChubboChat.services.stickyScroll();
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
          text: me.botMessages.hello,
          sender: 'bot'
        });
      } else if (me.surveyQuestions.length === 0) {
        if (!me.isSurveyComplete) {
          //say bye
          me.messages.push({
            text: me.botMessages.goodbye,
            sender: 'bot'
          });
        }
        me.isSurveyComplete = true;
      } else {
        //send a survey question
        me.messages.push(me.surveyQuestions[0]);
        me.surveyQuestions.splice(0, 1);
      }
    }
  }
 });
