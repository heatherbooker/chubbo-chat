//libraries
import Vue from 'vue'
//services
import surveyApi from '../../services/surveyApi.js'
import 'vue-sticky-scroll'
//components
import messageBubble from './messageBubble.js'
//styles
import '../../../stylesheets/chat.css'


export default Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages" v-sticky-scroll>
          <message-bubble
            v-for="message in messages"
            :message="message"
            :index="$index"
            @button-clicked="handleBtnClick"
          >
          </message-bubble>
        </div>
        <div class="cc-chat-inputBlock">
          <textarea
            class="cc-chat-input"
            v-model="chatInput"
            @keyup.enter="handleSubmitMsg"
          ></textarea>
          <span :class="sendBtnClass" @click="handleSubmitMsg">
            send
          </span>
        </div>
      </div>
    </div>
  `,
  components: {
    'message-bubble': messageBubble
  },
  data: function() {
    return {
      chatInput: '',
      messages: [],
      surveyInfo: {
        userId: this.$route.params.userId,
        surveyId: this.$route.params.surveyId
      },
      surveyQuestions: [],
      surveyResponses: [],
      botMessages: {
        hello: `Hi there! I'm Chubbo, your favourite friendly survey administerator. Let's get started - 
                any time there is a question that doesn't require a text answer, you can send any
                text to tell me you are ready for the next question. Try it now!`,
        confirm: `That's all for now! I'm going to send this to my master, ok?`,
        goodbye: `Thanks for chatting with me today! Visit
          chubbo-chat.herokuapp.com/#!/dashboard to create your own friendly survey!`
      },
      isSurveyComplete: false,
      isSurveySent: false
    };
  },
  computed: {
    sendBtnClass: function() {
      if (this.chatInput === '') {
        return 'cc-chat-sendBtn-disabled';
      }
      return 'cc-chat-sendBtn';
    }
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
      return surveyApi.getSpecificSurvey(me.surveyInfo.userId, me.surveyInfo.surveyId)
      .then(function(data) {
        me.surveyQuestions = data.questions.map(function(question) {
          return {
            ...question,
            sender: 'bot'
          };
        });
      });
    },
    handleSubmitMsg: function() {
      if (this.chatInput !== '') {
        this.messages.push({
          text: this.chatInput,
          type: 'text',
          sender: 'user'
        });
        this.surveyResponses.push(`{"text": "${this.chatInput.trim()}"}`);
        this.chatInput = '';
        this.sendSurveyQuestion(this);
      }
    },
    sendSurveyQuestion: function(me) {
      if (me.messages.length <= 1) {
        //first message!
        me.messages.push({
          text: me.botMessages.hello,
          type: 'text',
          sender: 'bot'
        });
      } else if (me.surveyQuestions.length === 0) {
        if (!me.isSurveyComplete) {
          //say bye
          me.messages.push({
            text: me.botMessages.confirm,
            type: 'buttons',
            buttons: ['Sure!'],
            sender: 'bot'
          });
        }
        me.isSurveyComplete = true;
      } else {
        //send a survey question
        me.messages.push(me.surveyQuestions[0]);
        me.surveyQuestions.splice(0, 1);
      }
    },
    gatherResponses() {
      // We don't need to save the user's greeting to the bot.
      this.surveyResponses.splice(0,1);
      var responses = [...this.surveyResponses];
      $('input[type="range"]').each(function(i, slider) {
        var id = $(slider).attr('id');
        var index = id.substring(id.length - 1);
        responses[index] = JSON.stringify({slider: $(slider).val()});
      });
      $('input[type="radio"]:checked').each(function(i, radio) {
        var id = $(radio).attr('id');
        var index = id.substring(id.length - 1);
        responses[index] = JSON.stringify({radio: $(radio).val()});
      });
      responses.splice(responses.length - 1, 1);
      return responses;
    },
    sendToDatabase: function(responses) {
      surveyApi.sendSurveyResponses(
        this.surveyInfo.userId, this.surveyInfo.surveyId, `[${responses}]`
      );
    },
    handleBtnClick(button) {
      if (!this.isSurveySent) {
        this.sendToDatabase(this.gatherResponses());
        // Invite the user to make their own survey.
        this.messages.push({
          text: this.botMessages.goodbye,
          type: 'text',
          sender: 'bot'
        });
        this.isSurveySent = true;
      }
    }
  }
 });
