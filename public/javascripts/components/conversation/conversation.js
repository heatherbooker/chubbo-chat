window.ChubboChat.components.conversation = Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages">
          <div
            :class="message.sender === 'bot' ? 'cc-chatRow-bot' : 'cc-chatRow'"
            v-for="message in messages"
          >
            <div :class="message.sender === 'bot' ? 'cc-chatBubble-bot' : 'cc-chatBubble-reply'">
              {{message.text}}
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
      //keep track of order of messages
      index: 0,
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
      return window.ChubboChat.services.surveyApi.getSpecificSurvey(this.$route.params.user, this.$route.params.title)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var surveyKey = Object.keys(data);
        me.surveyQuestions = data[surveyKey].questions.map(function(question) {
          return {
            text: question,
            sender: 'bot'
          };
        });
      });
    },
    handleSubmitMsg: function() {
      this.messages.push({
        index: this.index,
        text: this.chatInput,
        sender: 'user'
      });
      this.index ++;
      this.chatInput = '';
      this.sendSurveyQuestion(this);
    },
    sendSurveyQuestion: function(me) {
      var message;
      if (me.index === 0) {
        //first message!
        message = {
          index: 0,
          text: 'Hi there!',
          sender: 'bot'
        }
      } else if (me.surveyQuestions.length === 0) {
        //no survey questions left!
        if (!me.isSurveyComplete) {
          //we haven't said bye yet
          message = {
            index: me.index,
            text: 'Thanks for taking the survey! Would you like to create your own?',
            sender: 'bot'
          }
          me.isSurveyComplete = true;
          //TO DO: send some buttons, help them sign up
        }
      } else {
        //send a survey question
        message = me.surveyQuestions[0];
        message.index = me.index;
        me.surveyQuestions.splice(0, 1);
      }
      me.messages.push(message);
      me.index ++;
    }
  }
 });
